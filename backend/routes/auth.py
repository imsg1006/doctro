from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db.deps import get_db
from models.user import User
from core.security import hash_password, verify_password
from core.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# -------- Schemas --------
class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str
    name: str = None
    specialization: str = None


class LoginRequest(BaseModel):
    email: str
    password: str


# -------- Register --------
@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
        specialization=data.specialization
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}


# -------- Login --------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"user_id": user.id, "role": user.role, "name": user.name, "specialization": user.specialization}
    )

    return {"access_token": token, "token_type": "bearer"}
