from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI"])


class AIQuery(BaseModel):
    question: str


@router.post("/ask")
def ask_ai(data: AIQuery):
    return {
        "answer": (
            "I am not a doctor, but based on your symptoms, "
            "it is recommended to consult a professional."
        )
    }
