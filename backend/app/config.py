import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.getenv("SECRET_KEY", "military-training-simulator-secret-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 7 * 24 * 60

DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'military_training.db')}"

EVENTS_FILE = os.path.join(BASE_DIR, "data", "events.json")
ENDINGS_FILE = os.path.join(BASE_DIR, "data", "endings.json")
STATIC_DIR = os.path.join(BASE_DIR, "static")
