import os

SECRET_KEY = os.getenv("SECRET_KEY", "findora_super_secret_ai_key_2026_discovery_engine")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./findora.db")

# Vector Search / Model settings
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
LOW_LATENCY_MAX_MS = 80
