from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import init_db
from .routers import auth, medicines, prescriptions, orders, payments, users

app = FastAPI(
    title="MediGo API",
    description="On-demand medicine delivery platform - browse medicines, upload prescriptions, place orders, and track deliveries.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth.router, prefix="/api")
app.include_router(medicines.router, prefix="/api")
app.include_router(prescriptions.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(users.router, prefix="/api")

# serves uploaded prescription images at e.g. /uploads/prescriptions/<filename>
# the "uploads/prescriptions" folder itself is created in routers/prescriptions.py
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def home():
    return {"message": "Welcome to the MediGo API", "status": "online", "version": "1.0.0"}
