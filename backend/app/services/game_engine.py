import json
import random
import os
from typing import Dict, Any, Optional, List
from app.config import EVENTS_FILE
from app.core.attribute_system import AttributeSystem
from app.core.endings import generate_ending, generate_score

PHASE_SEQUENCE = ["morning", "training", "noon", "afternoon", "rest", "evening", "night"]
FIXED_EVENTS = {
    ("morning", "morning_jog"),
    ("evening", "evening_roll_call"),
}


def clamp(value, min_val=0, max_val=100):
    return max(min_val, min(value, max_val))


def check_range(actual, condition):
    if isinstance(condition, (int, float)):
        return actual == condition
    if isinstance(condition, dict):
        if "gte" in condition and actual < condition["gte"]:
            return False
        if "lte" in condition and actual > condition["lte"]:
            return False
        if "eq" in condition and actual != condition["eq"]:
            return False
        return True
    return False


def check_condition(condition: Dict, player: Dict) -> bool:
    if not condition:
        return True
    for key, value in condition.items():
        if key == "day":
            if not check_range(player["day"], value):
                return False
        elif key == "phase":
            if player["phase"] != value:
                return False
        elif key == "weather":
            if player.get("weather") != value:
                return False
        elif key in player:
            if not check_range(player[key], value):
                return False
        elif key in player.get("flags", {}):
            if player["flags"][key] != value:
                return False
        else:
            return False
    return True


def apply_effects(player: Dict, effects: Dict):
    if not effects:
        return
    for attr, delta in effects.items():
        if attr in ["stamina", "discipline", "mood", "instructor_favor", "classmate_relation", "health", "thirst"]:
            player[attr] = clamp(player[attr] + delta)
        elif attr == "day":
            player["day"] += delta


def apply_set_flags(player: Dict, flags: Dict):
    if flags:
        player["flags"].update(flags)


def weighted_choice(events: List[Dict], event_cooldown: Dict) -> Dict:
    total = 0
    weights = []
    for e in events:
        w = e.get("weight", 1)
        cd = event_cooldown.get(e["id"], 0)
        if cd > 0:
            w = max(0.1, w - 0.5 * cd)
        weights.append(w)
        total += w

    if total <= 0:
        return random.choice(events)

    r = random.uniform(0, total)
    upto = 0
    for i, e in enumerate(events):
        upto += weights[i]
        if upto >= r:
            return e
    return events[-1]


class GameEngine:
    def __init__(self):
        self.events: List[Dict] = []
        self._load_events()
        self.active_games: Dict[int, Dict] = {}

    def _load_events(self):
        with open(EVENTS_FILE, "r", encoding="utf-8") as f:
            self.events = json.load(f)

    def _init_player(self, player_name: str = "李明") -> Dict[str, Any]:
        return {
            "player_name": player_name,
            "stamina": 80,
            "discipline": 60,
            "mood": 70,
            "instructor_favor": 50,
            "classmate_relation": 50,
            "health": 80,
            "thirst": 30,
            "day": 0,
            "phase": "evening",
            "weather": "sunny",
            "flags": {
                "has_uniform": True,
                "formation": None,
                "is_monitor": False,
                "is_pacesetter": False,
                "injured": False,
                "rested": False,
                "well_prepared": True,
                "blister": False,
                "attended_opening": False,
                "helped_classmate": False,
                "performed": False,
                "neat_room": False,
                "emergency_ready": False,
            },
            "event_cooldown": {},
            "current_event": None,
            "remark": None,
            "endings": None,
            "score": None,
            "grade": None,
            "game_over": False,
        }

    def _create_fallback_event(self, player: Dict) -> Dict:
        phase = player["phase"]
        phase_names = {
            "morning": "清晨时光", "training": "训练间隙", "noon": "午间休息",
            "afternoon": "午后时光", "rest": "休息时间", "evening": "晚间时段", "night": "夜间时光"
        }
        base_effects = {"stamina": 5, "mood": 3, "thirst": 5}
        return {
            "id": f"free_time_{phase}",
            "title": phase_names.get(phase, "自由时间"),
            "description": "一切平静，没有特别的事情发生。你可以自由安排时间。",
            "options": [
                {"text": "休息片刻，恢复体力", "effects": {"stamina": 10, "mood": 5, "thirst": 3}},
                {"text": "主动加练，提升纪律", "effects": {"discipline": 5, "stamina": -8, "thirst": 8}},
                {"text": "和同学聊天放松", "effects": {"classmate_relation": 5, "mood": 5}},
            ]
        }

    def _select_event(self, player: Dict) -> Optional[Dict]:
        chosen = None

        for phase_key, event_id in FIXED_EVENTS:
            if player["phase"] == phase_key:
                for e in self.events:
                    if e["id"] == event_id and check_condition(e.get("condition", {}), player):
                        chosen = e
                        break
                break

        if chosen is None:
            available = [e for e in self.events if check_condition(e.get("condition", {}), player)]
            if available:
                chosen = weighted_choice(available, player.get("event_cooldown", {}))

        if chosen is None:
            chosen = self._create_fallback_event(player)

        return chosen

    def _advance_phase(self, player: Dict):
        phases = PHASE_SEQUENCE
        current_idx = phases.index(player["phase"]) if player["phase"] in phases else 0

        if current_idx + 1 < len(phases):
            player["phase"] = phases[current_idx + 1]
        else:
            player["day"] += 1
            player["phase"] = phases[0]
            weather_roll = random.random()
            if weather_roll < 0.2:
                player["weather"] = "rain"
            elif weather_roll < 0.4:
                player["weather"] = "windy"
            else:
                player["weather"] = "sunny"

        if player["phase"] in ["training", "noon"]:
            player["thirst"] = clamp(player["thirst"] + random.randint(3, 8))

        if player["health"] <= 0 or player["stamina"] <= 0:
            player["health"] = clamp(player["health"] + 20)
            player["stamina"] = clamp(player["stamina"] + 30)
            player["mood"] = clamp(player["mood"] - 10)
            player["remark"] = "你的身体已经无法支撑，被送往医务室休息。休息后感觉好了一些，但心情有些低落。"

        if player["thirst"] >= 80:
            player["stamina"] = clamp(player["stamina"] - 5)
            player["mood"] = clamp(player["mood"] - 10)

    def start_game(self, user_id: int, player_name: str = "李明") -> Dict[str, Any]:
        player = self._init_player(player_name)
        player["day"] = 0
        player["phase"] = "evening"
        event = self._select_event(player)
        player["current_event"] = event
        self.active_games[user_id] = player
        return self._to_game_state(player)

    def choose_option(self, user_id: int, option_index: int) -> Dict[str, Any]:
        player = self.active_games.get(user_id)
        if player is None:
            return {"error": "No active game. Please start a new game."}

        if player.get("game_over"):
            return self._to_game_state(player)

        event = player.get("current_event")
        if not event:
            event = self._select_event(player)
            if event is None:
                return {"error": "No current event."}
            player["current_event"] = event

        options = event.get("options", [])
        if option_index < 0 or option_index >= len(options):
            return {"error": "Invalid option index."}

        option = options[option_index]
        remark = ""

        apply_effects(player, option.get("effects", {}))
        apply_set_flags(player, option.get("set_flags", {}))

        if "chance" in option:
            if random.random() < option["chance"]:
                se = option.get("success_effects", {})
                apply_effects(player, {k: v for k, v in se.items() if k not in ["remark"]})
                apply_set_flags(player, option.get("success_set_flags", {}))
                remark = se.get("remark", option.get("success_remark", ""))
            else:
                fe = option.get("fail_effects", {})
                apply_effects(player, {k: v for k, v in fe.items() if k not in ["remark"]})
                apply_set_flags(player, option.get("fail_set_flags", {}))
                remark = fe.get("remark", option.get("fail_remark", ""))

        if option.get("set_flags", {}).get("is_pacesetter") is not None:
            player["flags"]["is_pacesetter"] = option["set_flags"]["is_pacesetter"]

        event_id = event["id"]
        player["event_cooldown"][event_id] = player["event_cooldown"].get(event_id, 0) + 3
        player["remark"] = remark if remark else None

        if player["health"] <= 0:
            player["game_over"] = True
            player["endings"] = [{"title": "健康归零", "description": "由于健康原因，你未能完成全程军训，被紧急送往医务室。这段经历提醒你：身体是革命的本钱。", "tags": ["健康", "教训"]}]
            player["score"] = 0
            player["grade"] = "D"
            return self._to_game_state(player)

        self._advance_phase(player)

        if player["day"] > 7:
            player["game_over"] = True
            score, grade = generate_score(player)
            player["score"] = score
            player["grade"] = grade
            endings = generate_ending(player, max_results=3)
            player["endings"] = endings
            player["current_event"] = None
            return self._to_game_state(player)

        event = self._select_event(player)
        player["current_event"] = event
        return self._to_game_state(player)

    def get_state(self, user_id: int) -> Optional[Dict[str, Any]]:
        player = self.active_games.get(user_id)
        if player is None:
            return None
        return self._to_game_state(player)

    def load_state(self, user_id: int, state: Dict[str, Any]):
        self.active_games[user_id] = state

    def save_state(self, user_id: int) -> Optional[Dict[str, Any]]:
        player = self.active_games.get(user_id)
        if player is None:
            return None
        return json.loads(json.dumps(player))

    def _to_game_state(self, player: Dict) -> Dict[str, Any]:
        return {
            "player_name": player.get("player_name", ""),
            "attributes": {
                "stamina": player.get("stamina", 80),
                "discipline": player.get("discipline", 60),
                "mood": player.get("mood", 70),
                "instructor_favor": player.get("instructor_favor", 50),
                "classmate_relation": player.get("classmate_relation", 50),
                "health": player.get("health", 80),
                "thirst": player.get("thirst", 30),
            },
            "flags": player.get("flags", {}),
            "day": player.get("day", 1),
            "phase": player.get("phase", "morning"),
            "weather": player.get("weather", "sunny"),
            "current_event": player.get("current_event"),
            "remark": player.get("remark"),
            "endings": player.get("endings"),
            "score": player.get("score"),
            "grade": player.get("grade"),
            "game_over": player.get("game_over", False),
        }


engine = GameEngine()
