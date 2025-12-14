from fastapi import FastAPI

app = FastAPI(title="Sweet Shop API")

@app.get("/")
def root():
    return {"message": "Sweet Shop API is running"}

from database import engine
from models import Base

Base.metadata.create_all(bind=engine)

from sqlalchemy.orm import Session
from database import SessionLocal
from models import Sweet
from models import SweetCreate


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import Depends

@app.get("/sweets")
def get_sweets(db: Session = Depends(get_db)):
    sweets = db.query(Sweet).all()
    return sweets

@app.post("/sweets")
def create_sweet(sweet: SweetCreate, db: Session = Depends(get_db)):
    new_sweet = Sweet(
        name=sweet.name,
        category=sweet.category,
        price=sweet.price,
        quantity=sweet.quantity
    )
    db.add(new_sweet)
    db.commit()
    db.refresh(new_sweet)
    return new_sweet
