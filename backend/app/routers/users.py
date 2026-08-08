from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.models import UserInteraction, BrowsingHistory, Product, User
from app.schemas.pydantic_schemas import TrackInteractionRequest, ProductSchema
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users & Real-time Behavior Tracking"])

@router.post("/track")
def track_behavior(req: TrackInteractionRequest, db: Session = Depends(get_db)):
    """
    Real-Time Behavior Tracking (<80ms latency logging)
    Logs user events (view, click, cart, search) to feed Intent & Recommendation Engine
    """
    score_map = {"view": 1.0, "click": 1.5, "cart": 3.0, "search": 2.5, "purchase": 5.0}
    score = score_map.get(req.action, 1.0)

    interaction = UserInteraction(
        product_id=req.product_id,
        action=req.action,
        session_id=req.session_id,
        score=score
    )
    db.add(interaction)

    # Log to browsing history
    b_history = BrowsingHistory(
        session_id=req.session_id,
        product_id=req.product_id,
        action_type=req.action,
        duration_seconds=req.duration_seconds or 5
    )
    db.add(b_history)
    db.commit()

    return {"status": "success", "action": req.action, "product_id": req.product_id}

@router.get("/browsing-history", response_model=List[ProductSchema])
def get_browsing_history(session_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(BrowsingHistory)
    if session_id:
        query = query.filter(BrowsingHistory.session_id == session_id)

    recent = query.order_by(BrowsingHistory.created_at.desc()).limit(10).all()
    p_ids = list(dict.fromkeys([h.product_id for h in recent])) # preserve order deduplicate

    if not p_ids:
        return []

    products = db.query(Product).filter(Product.id.in_(p_ids)).all()
    prod_map = {p.id: p for p in products}
    
    ordered_prods = []
    for pid in p_ids:
        if pid in prod_map:
            p = prod_map[pid]
            if p.category:
                p.category_name = p.category.name
            ordered_prods.append(p)

    return ordered_prods
