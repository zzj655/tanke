import json
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Save
from app.schemas import StartGameRequest, ChooseRequest, GameState, SaveSlotRequest, SaveInfo
from app.auth import decode_token
from app.services.game_engine import engine

router = APIRouter(prefix="/api/game", tags=["game"])


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供认证信息")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="无效的认证信息")
    user_id = int(payload.get("sub", 0))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    return user


@router.post("/start", response_model=GameState)
def start_game(req: StartGameRequest, user: User = Depends(get_current_user)):
    state = engine.start_game(user.id, req.player_name)
    return state


@router.post("/choose", response_model=GameState)
def choose_option(req: ChooseRequest, user: User = Depends(get_current_user)):
    result = engine.choose_option(user.id, req.option_index)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/state", response_model=GameState)
def get_state(user: User = Depends(get_current_user)):
    state = engine.get_state(user.id)
    if state is None:
        raise HTTPException(status_code=400, detail="没有进行中的游戏")
    return state


@router.get("/saves", response_model=list[SaveInfo])
def list_saves(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    saves = db.query(Save).filter(Save.user_id == user.id).all()
    result = []
    for slot in range(1, 4):
        save = next((s for s in saves if s.slot == slot), None)
        if save:
            result.append(SaveInfo(
                slot=slot,
                player_name=save.player_name,
                day=save.day,
                created_at=save.created_at.strftime("%Y-%m-%d %H:%M") if save.created_at else "",
                updated_at=save.updated_at.strftime("%Y-%m-%d %H:%M") if save.updated_at else "",
                exists=True
            ))
        else:
            result.append(SaveInfo(slot=slot, player_name="", day=0, created_at="", updated_at="", exists=False))
    return result


@router.post("/save", response_model=dict)
def save_game(req: SaveSlotRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    state = engine.save_state(user.id)
    if state is None:
        raise HTTPException(status_code=400, detail="没有进行中的游戏")

    save = db.query(Save).filter(Save.user_id == user.id, Save.slot == req.slot).first()
    if save:
        save.player_name = state.get("player_name", "")
        save.day = state.get("day", 1)
        save.save_data = json.dumps(state, ensure_ascii=False)
    else:
        save = Save(
            user_id=user.id,
            slot=req.slot,
            player_name=state.get("player_name", ""),
            day=state.get("day", 1),
            save_data=json.dumps(state, ensure_ascii=False),
        )
        db.add(save)
    db.commit()
    return {"message": f"游戏已保存到槽位 {req.slot}"}


@router.post("/load", response_model=GameState)
def load_game(req: SaveSlotRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    save = db.query(Save).filter(Save.user_id == user.id, Save.slot == req.slot).first()
    if not save:
        raise HTTPException(status_code=400, detail=f"槽位 {req.slot} 没有存档")
    state = json.loads(save.save_data)
    engine.load_state(user.id, state)
    return engine.get_state(user.id)


@router.delete("/saves/{slot}", response_model=dict)
def delete_save(slot: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    save = db.query(Save).filter(Save.user_id == user.id, Save.slot == slot).first()
    if save:
        db.delete(save)
        db.commit()
        return {"message": f"槽位 {slot} 存档已删除"}
    raise HTTPException(status_code=404, detail=f"槽位 {slot} 没有存档")
