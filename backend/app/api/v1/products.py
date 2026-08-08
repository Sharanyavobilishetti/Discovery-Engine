from fastapi import APIRouter, Query, HTTPException, Path
from typing import List, Optional
from app.models.product import Product, CategoryCount
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products & Catalog"])

@router.get("", response_model=List[Product])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category name"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    intent: Optional[str] = Query(None, description="Filter by active shopping intent (budget, urgent, fashion, seasonal)"),
    search: Optional[str] = Query(None, description="Search keyword in name or tags"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Retrieve catalog products with optional filtering by price range, intent, category, and keyword search."""
    return await ProductService.get_all_products(
        category=category,
        min_price=min_price,
        max_price=max_price,
        intent=intent,
        search_query=search,
        limit=limit,
        skip=skip
    )

@router.get("/categories", response_model=List[CategoryCount])
async def get_categories():
    """Retrieve all catalog categories along with item count and preview images."""
    return await ProductService.get_categories()

@router.get("/search", response_model=List[Product])
async def search_products(
    q: str = Query(..., min_length=1, description="Search query string")
):
    """Search products across catalog matching query tags, names, or categories."""
    return await ProductService.get_all_products(search_query=q)

@router.get("/{product_id}", response_model=Product)
async def get_product_detail(
    product_id: str = Path(..., description="Unique product ID e.g. prod_101")
):
    """Retrieve details for a single product by unique ID."""
    product = await ProductService.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' not found.")
    return product
