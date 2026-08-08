from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Wishlist, Product, User
from app.schemas.pydantic_schemas import ProductSchema
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[ProductSchema])
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()
    p_ids = [item.product_id for item in items]
    
    if not p_ids:
        return []

    products = db.query(Product).filter(Product.id.in_(p_ids)).all()
    for p in products:
        if p.category:
            p.category_name = p.category.name
    return products

@router.post("/{product_id}")
def add_to_wishlist(product_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Wishlist).filter(Wishlist.user_id == current_user.id, Wishlist.product_id == product_id).first()
    if existing:
        return {"message": "Already in wishlist"}

    item = Wishlist(user_id=current_user.id, product_id=product_id)
    db.add(item)
    db.commit()

    return {"message": "Added to wishlist"}

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Wishlist).filter(Wishlist.user_id == current_user.id, Wishlist.product_id == product_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Removed from wishlist"}
    return {"message": "Not in wishlist"}
