from fastapi import Depends, HTTPException, status
from auth import get_current_user
from models import User


def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.email != "admin@shop.com":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
