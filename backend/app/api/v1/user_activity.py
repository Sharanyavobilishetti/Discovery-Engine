from fastapi import APIRouter, Depends, HTTPException, Path, Body
from typing import List, Dict, Any
from app.models.user import CartRequest
from app.services.auth_service import AuthService
from app.services.product_service import ProductService

router = APIRouter(prefix="/user", tags=["User Cart & Wishlist Management"])

@router.get("/cart")
async def get_user_cart(current_user: dict = Depends(AuthService.get_current_user)):
    """Retrieve full cart items with product details."""
    cart_items = current_user.get("cart", [])
    result = []
    for item in cart_items:
        product = await ProductService.get_product_by_id(item["product_id"])
        if product:
            result.append({
                "product": product,
                "quantity": item.get("quantity", 1)
            })
    return {"cart": result, "count": len(result)}

@router.post("/cart")
async def add_cart_item(
    cart_req: CartRequest,
    current_user: dict = Depends(AuthService.get_current_user)
):
    """Add a product to user cart or update quantity."""
    updated_cart = await AuthService.add_to_cart(current_user["id"], cart_req.product_id, cart_req.quantity)
    return {"message": "Product added to cart successfully", "cart": updated_cart}

@router.delete("/cart/{product_id}")
async def remove_cart_item(
    product_id: str = Path(...),
    current_user: dict = Depends(AuthService.get_current_user)
):
    """Remove a product from user cart."""
    updated_cart = await AuthService.remove_from_cart(current_user["id"], product_id)
    return {"message": "Product removed from cart", "cart": updated_cart}

@router.get("/wishlist")
async def get_user_wishlist(current_user: dict = Depends(AuthService.get_current_user)):
    """Retrieve user wishlist product list."""
    wishlist_ids = current_user.get("wishlist", [])
    products = []
    for pid in wishlist_ids:
        prod = await ProductService.get_product_by_id(pid)
        if prod:
            products.append(prod)
    return {"wishlist": products, "count": len(products)}

@router.post("/wishlist/{product_id}")
async def toggle_wishlist_item(
    product_id: str = Path(...),
    current_user: dict = Depends(AuthService.get_current_user)
):
    """Add or remove product from wishlist."""
    updated_wishlist = await AuthService.toggle_wishlist(current_user["id"], product_id)
    return {"message": "Wishlist updated", "wishlist": updated_wishlist}
