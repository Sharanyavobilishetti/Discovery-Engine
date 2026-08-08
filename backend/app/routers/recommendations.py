from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.models.models import Product
from app.schemas.pydantic_schemas import ProductSchema, RecommendationResponse
from app.services.ai_engine import AIEngine

router = APIRouter(prefix="/api/recommendations", tags=["Recommendation Engine"])

@router.get("/two-tower", response_model=RecommendationResponse)
def get_two_tower_recs(
    session_id: Optional[str] = None,
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """
    Two-Tower Model Recommendations (User Tower x Product Tower match)
    """
    intents = AIEngine.extract_session_intents(db, session_id=session_id)
    intent_names = [i["intent"] for i in intents]

    results = AIEngine.get_two_tower_recommendations(db, session_id=session_id, limit=limit)

    prods = []
    for product, score, explanation in results:
        if product.category:
            product.category_name = product.category.name
        product.match_score = score
        product.explanation = explanation
        prods.append(product)

    return {
        "algorithm": "Two-Tower Neural Intent Matching",
        "description": "User intent vector matched with high-dimensional product features in real-time.",
        "detected_session_intents": intent_names,
        "products": prods
    }

@router.get("/content-based/{product_id}", response_model=List[ProductSchema])
def get_content_based_recs(product_id: int, limit: int = Query(6, ge=1, le=12), db: Session = Depends(get_db)):
    products = AIEngine.get_content_based_recommendations(db, product_id, limit)
    for p in products:
        if p.category:
            p.category_name = p.category.name
        p.explanation = f"Similar features & category match with item #{product_id}"
    return products

@router.get("/frequently-bought-together/{product_id}", response_model=List[ProductSchema])
def get_frequently_bought_together(product_id: int, limit: int = Query(3, ge=1, le=6), db: Session = Depends(get_db)):
    products = AIEngine.get_frequently_bought_together(db, product_id, limit)
    for p in products:
        if p.category:
            p.category_name = p.category.name
        p.explanation = "Frequently ordered in the same purchase"
    return products

@router.get("/complete-the-look/{product_id}", response_model=List[ProductSchema])
def get_complete_the_look(product_id: int, limit: int = Query(3, ge=1, le=6), db: Session = Depends(get_db)):
    products = AIEngine.get_complete_the_look(db, product_id, limit)
    for p in products:
        if p.category:
            p.category_name = p.category.name
        p.explanation = "Curated outfit style pairing"
    return products

@router.get("/cold-start", response_model=List[ProductSchema])
def get_cold_start_recs(limit: int = Query(8, ge=1, le=16), db: Session = Depends(get_db)):
    products = AIEngine.get_cold_start_recommendations(db, limit)
    for p in products:
        if p.category:
            p.category_name = p.category.name
        p.explanation = "Top customer choice for new shoppers"
    return products

@router.get("/trending", response_model=List[ProductSchema])
def get_trending_products(limit: int = Query(8, ge=1, le=16), db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_trending == True).order_by(Product.rating.desc()).limit(limit).all()
    for p in products:
        if p.category:
            p.category_name = p.category.name
        p.explanation = "Trending right now based on search & buy spikes"
    return products
