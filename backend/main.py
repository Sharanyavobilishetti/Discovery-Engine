from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.db.mongodb import db_manager
from app.api.v1.products import router as products_router
from app.api.v1.auth import router as auth_router
from app.api.v1.user_activity import router as user_activity_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.intent import router as intent_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("uvicorn")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Production-grade AI Multi-Intent E-commerce Recommendation System API"
)

# Register API Routers
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(user_activity_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(intent_router, prefix=settings.API_V1_STR)





# Set up CORS middleware for frontend React integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Initializing FastAPI Backend Services & Database Client...")
    await db_manager.connect_to_database(settings.MONGODB_URL, settings.DATABASE_NAME)
    try:
        from seed_data import seed_database
        await seed_database()
    except Exception as e:
        logger.warning(f"Database auto-seeding skipped: {e}")
    logger.info("Backend Application Startup Complete.")

@app.on_event("shutdown")
async def shutdown_db_client():
    await db_manager.close_database_connection()

from fastapi.responses import FileResponse
import os

@app.get("/demo")
async def serve_demo():
    demo_path = os.path.join(os.path.dirname(__file__), "app", "static", "demo.html")
    return FileResponse(demo_path)

@app.get("/")
async def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "demo_url": "/demo",
        "api_v1": settings.API_V1_STR
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database_status": "connected" if db_manager.is_connected else "in-memory-fallback",
        "faiss_enabled": settings.USE_FAISS
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
