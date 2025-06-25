from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import views

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def status():
    return {"message": "API está online"}

app.include_router(views.router, prefix="/api", tags=["dashboard"])