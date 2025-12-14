from pydantic import BaseModel, EmailStr
from typing import Optional



# User Schemas


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True



# Sweet Schemas

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int


class SweetCreate(SweetBase):
    pass


class SweetResponse(SweetBase):
    id: int

    class Config:
        orm_mode = True
