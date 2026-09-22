from typing import Dict, Any, Optional, List
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    username: str


class StartGameRequest(BaseModel):
    player_name: str = "李明"
    slot: int = 1


class ChooseRequest(BaseModel):
    option_index: int


class SaveSlotRequest(BaseModel):
    slot: int


class GameState(BaseModel):
    player_name: str = ""
    attributes: Dict[str, int] = {}
    flags: Dict[str, Any] = {}
    day: int = 1
    phase: str = "morning"
    weather: str = "sunny"
    current_event: Optional[Dict[str, Any]] = None
    remark: Optional[str] = None
    endings: Optional[List[Dict[str, Any]]] = None
    score: Optional[int] = None
    grade: Optional[str] = None
    game_over: bool = False


class SaveInfo(BaseModel):
    slot: int
    player_name: str
    day: int
    created_at: str
    updated_at: str
    exists: bool
