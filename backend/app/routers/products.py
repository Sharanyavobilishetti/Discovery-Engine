from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from math import ceil

from app.database import get_db
from app.models.models import Product, Category, UserInteraction
from app.schemas.pydantic_schemas import ProductSchema, ProductListResponse, CategorySchema

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("/categories", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("", response_model=ProductListResponse)
def get_products(
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=50),
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    sort_by: Optional[str] = "popular", # popular, price_asc, price_desc, rating, new
    is_trending: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    if is_trending is not None:
        query = query.filter(Product.is_trending == is_trending)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    elif sort_by == "new":
        query = query.order_by(Product.is_new_arrival.desc(), Product.created_at.desc())
    else: # popular
        query = query.order_by(Product.is_trending.desc(), Product.reviews_count.desc(), Product.rating.desc())

    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()

    # Populate category names
    for item in items:
        if item.category:
            item.category_name = item.category.name

    pages = ceil(total / size) if size > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }

@router.get("/{product_id}", response_model=ProductSchema)
def get_product_details(product_id: int, session_id: Optional[str] = None, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.category:
        product.category_name = product.category.name

    # Log interaction for real-time intent engine
    interaction = UserInteraction(
        product_id=product_id,
        action="view",
        session_id=session_id,
        score=1.0
    )
    db.add(interaction)
    db.commit()

    return product
