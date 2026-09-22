from typing import Dict, Any, Optional, Tuple, List, Callable
import copy


class AttributeSystem:
    DEFAULT_LIMITS = {
        "stamina": (0, 100),
        "discipline": (0, 100),
        "mood": (0, 100),
        "instructor_favor": (0, 100),
        "classmate_relation": (0, 100),
        "health": (0, 100),
        "thirst": (0, 100),
    }

    DEFAULT_ATTRS = {
        "stamina": 80,
        "discipline": 60,
        "mood": 70,
        "instructor_favor": 50,
        "classmate_relation": 50,
        "health": 80,
        "thirst": 30,
    }

    DEFAULT_FLAGS = {
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
    }

    def __init__(self):
        self.attributes: Dict[str, int] = dict(self.DEFAULT_ATTRS)
        self.flags: Dict[str, Any] = dict(self.DEFAULT_FLAGS)

    def _clamp(self, attr: str, value: int) -> int:
        if attr in self.DEFAULT_LIMITS:
            lo, hi = self.DEFAULT_LIMITS[attr]
            return max(lo, min(value, hi))
        return value

    def get(self, attr: str) -> Optional[int]:
        return self.attributes.get(attr)

    def set(self, attr: str, value: int):
        if attr in self.attributes:
            self.attributes[attr] = self._clamp(attr, value)
        return self

    def add(self, attr: str, delta: int):
        if attr in self.attributes:
            old = self.attributes[attr]
            self.attributes[attr] = self._clamp(attr, old + delta)
        return self

    def apply_effects(self, effects: Dict[str, Any]):
        for attr, delta in effects.items():
            if attr in self.attributes and isinstance(delta, (int, float)):
                self.add(attr, int(delta))
        return self

    def set_flag(self, flag: str, value: Any = True):
        self.flags[flag] = value
        return self

    def get_flag(self, flag: str, default: Any = False) -> Any:
        return self.flags.get(flag, default)

    def has_flag(self, flag: str) -> bool:
        return self.flags.get(flag, False) is True

    def apply_flags(self, flags: Dict[str, Any]):
        self.flags.update(flags)
        return self

    def to_dict(self) -> Dict[str, Any]:
        return {
            "attributes": copy.deepcopy(self.attributes),
            "flags": copy.deepcopy(self.flags),
        }

    def load_from_dict(self, data: Dict[str, Any]):
        if "attributes" in data:
            self.attributes = copy.deepcopy(data["attributes"])
        if "flags" in data:
            self.flags = copy.deepcopy(data["flags"])
        return self
