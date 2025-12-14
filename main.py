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
from typing import Optional


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

@app.get("/sweets/search")
def search_sweets(
    name: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Sweet)

    if name:
        query = query.filter(Sweet.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(Sweet.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Sweet.price >= min_price)
    if max_price is not None:
        query = query.filter(Sweet.price <= max_price)

    return query.all()

@app.post("/sweets/{sweet_id}/purchase")
def purchase_sweet(sweet_id: int, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    if sweet.quantity <= 0:
        raise HTTPException(status_code=400, detail="Sweet out of stock")

    sweet.quantity -= 1
    db.commit()
    db.refresh(sweet)
    return sweet

@app.post("/sweets/{sweet_id}/restock")
def restock_sweet(sweet_id: int, quantity: int, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    sweet.quantity += quantity
    db.commit()
    db.refresh(sweet)
    return sweet
