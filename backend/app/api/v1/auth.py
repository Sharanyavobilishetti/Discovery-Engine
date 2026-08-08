from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import UserCreate, UserLogin, Token, UserProfile
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["User Authentication & Security"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_account(user_in: UserCreate):
    """Register a new user account and receive JWT access token."""
    return await AuthService.register_user(user_in)

@router.post("/login", response_model=Token)
async def login_account(login_in: UserLogin):
    """Authenticate user with email and password to issue JWT bearer token."""
    return await AuthService.authenticate_user(login_in)

@router.get("/me", response_model=UserProfile)
async def get_user_profile(current_user: dict = Depends(AuthService.get_current_user)):
    """Retrieve current authenticated user profile."""
    return current_user
