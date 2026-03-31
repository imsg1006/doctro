from fastapi import APIRouter, Depends
from core.auth_dependency import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "user_id": current_user["user_id"],
        "role": current_user["role"]
    }
