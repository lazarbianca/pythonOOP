from fastapi import FastAPI
from controllers import math_controller
from db.database import init_db

app = FastAPI(title="Math Worker API")

init_db()  # This ensures the DB and table exist before requests are served
app.include_router(math_controller.router)


@app.get("/")
def root():
    return {"message": "Math API is running"}
