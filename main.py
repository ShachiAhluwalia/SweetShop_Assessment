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

from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session

from schemas import UserCreate, UserLogin, UserResponse
from security import hash_password, verify_password
from auth import create_access_token
from models import User

from auth import get_current_user
from permissions import admin_required
from models import User

from fastapi.security import OAuth2PasswordRequestForm



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import Depends

@app.get("/sweets")
def get_sweets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Sweet).all()


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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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
def purchase_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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



@app.post("/auth/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.post("/auth/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.post("/sweets", dependencies=[Depends(admin_required)])
def create_sweet(
    sweet: SweetCreate,
    db: Session = Depends(get_db)
):
    new_sweet = Sweet(**sweet.dict())
    db.add(new_sweet)
    db.commit()
    db.refresh(new_sweet)
    return new_sweet

@app.post("/sweets/{sweet_id}/restock", dependencies=[Depends(admin_required)])
def restock_sweet(
    sweet_id: int,
    quantity: int,
    db: Session = Depends(get_db)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    sweet.quantity += quantity
    db.commit()
    db.refresh(sweet)
    return sweet

@app.delete("/sweets/{sweet_id}", dependencies=[Depends(admin_required)])
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    db.delete(sweet)
    db.commit()
    return {"detail": "Sweet deleted successfully"}


