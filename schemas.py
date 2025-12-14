from pydantic import BaseModel, EmailStr, validator
from typing import Optional



# User Schemas


class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def validate_password_length(cls, v):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 characters or fewer")
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v



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
