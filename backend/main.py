from fastapi import FastAPI
from routes import auth, user, doctor , patients

from routes import ai
from fastapi.middleware.cors import CORSMiddleware
from db.session import engine
from models.base import Base



app = FastAPI()

Base.metadata.create_all(bind=engine)
app.include_router(ai.router)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(doctor.router)
app.include_router(patients.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:5174","http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
  
 

 