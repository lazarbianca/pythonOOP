from fastapi import FastAPI
from controllers import math_controller
from db.database import init_db
from fastapi.middleware.cors import CORSMiddleware
import sys

sys.set_int_max_str_digits(100_000_000)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # sau ["*"] temporar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
init_db()  
app.include_router(math_controller.router)


@app.get("/")
def root():
    return {"message": "Math API is running"}
