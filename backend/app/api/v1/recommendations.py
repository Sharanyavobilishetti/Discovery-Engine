from fastapi import APIRouter, Query, Path, Depends
from typing import List, Optional
from app.services.recommend_engine import HybridRecommendationEngine
from app.services.auth_service import AuthService

router = APIRouter(prefix="/recommendations", tags=["AI Recommendation Engine"])

@router.get("")
async def get_personalized_recommendations(
    user_id: Optional[str] = Query(None, description="Optional User ID for collaborative filtering context"),
    intent: Optional[str] = Query("Casual browsing", description="Active shopping intent"),
    category: Optional[str] = Query(None, description="Category constraint filter"),
    recent_product_ids: Optional[str] = Query(None, description="Comma-separated product IDs clicked during recent session"),
    limit: int = Query(10, ge=1, le=50)
):
    """Generate real-time personalized recommendations blending Collaborative, Content, and Session Intent scoring."""
    recent_list = recent_product_ids.split(",") if recent_product_ids else []
    return await HybridRecommendationEngine.get_recommendations(
        user_id=user_id,
        intent=intent,
        category=category,
        recent_product_ids=recent_list,
        limit=limit
    )

@router.get("/similar/{product_id}")
async def get_similar_recommendations(
    product_id: str = Path(..., description="Target product ID e.g. prod_101"),
    limit: int = Query(6, ge=1, le=20)
):
    """Retrieve top-N visually and metadata similar products using vector cosine distance."""
    return await HybridRecommendationEngine.get_similar_products(product_id, limit=limit)

@router.post("/visual-search")
async def visual_search_products(
    payload: dict = {},
    limit: int = Query(8, ge=1, le=20)
):
    """Perform AI Visual Search match against product feature embeddings."""
    vector = payload.get("embedding")
    # If no custom embedding provided, use product_101 (Footwear/Shoes) embedding fallback
    if not vector:
        from app.services.product_service import ProductService
        sample_prod = await ProductService.get_product_by_id("prod_101")
        vector = sample_prod["embedding"] if sample_prod else [0.1]*128
    return await HybridRecommendationEngine.search_by_visual_features(vector, limit=limit)

