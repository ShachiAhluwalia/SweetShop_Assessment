from sqlalchemy import Column, Integer, String, Float
from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy import Column, Integer, String
from database import Base


class Sweet(Base):
    __tablename__ = "sweets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)

from pydantic import BaseModel


class SweetCreate(BaseModel):
    name: str
    category: str
    price: float
    quantity: int


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # "user" or "admin"
