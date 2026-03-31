from fastapi import Depends, HTTPException
from core.jwt import decode_token
from fastapi.security import OAuth2PasswordBearer


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    return payload


def require_role(role: str):
    def role_checker(user = Depends(get_current_user)):
        if user["role"] != role:
            raise HTTPException(status_code=403, detail="Not authorized")
        return user
    return role_checker
