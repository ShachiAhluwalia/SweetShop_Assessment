from passlib.context import CryptContext

# Create a password context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Convert a plain password into a hashed password.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify if a plain password matches the hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)
