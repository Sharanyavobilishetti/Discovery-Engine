import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Multi-Intent E-Commerce Recommendation System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-key-change-in-production-ai-recommendation-system"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ecommerce_ai_db"

    USE_FAISS: bool = True
    FAISS_INDEX_DIM: int = 512

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
