from sqlalchemy import Column, Integer, String, Float
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
