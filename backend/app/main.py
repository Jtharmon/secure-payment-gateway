# backend/app/main.py

from fastapi import FastAPI

app = FastAPI()
from .routes import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Encrypted Payment Gateway!"}
