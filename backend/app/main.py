from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.services.semantic_search import semantic_search_engine

from app.routers import (
    auth,
    products,
    users,
    recommendations,
    search,
    wishlist,
    orders,
    dashboard
)

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Findora Discovery Engine API",
    description="Personalized Multi-Intent Product Recommendations & FAISS Vector Semantic Search",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(users.router)
app.include_router(recommendations.router)
app.include_router(search.router)
app.include_router(wishlist.router)
app.include_router(orders.router)
app.include_router(dashboard.router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        print("[FINDORA] Seeding Database...")
        seed_database(db)
        print("[FINDORA] Initializing FAISS Vector Semantic Index...")
        semantic_search_engine.initialize_index(db)
        print("[FINDORA] Backend Engine initialized and ready!")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Findora Discovery Engine",
        "version": "1.0.0",
        "docs": "/docs",
        "timestamp": time.time()
    }
