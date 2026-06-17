import re
import sqlite3
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator

from app.database import get_db_connection
from app.security import hash_password, verify_password, generate_session_token

router = APIRouter()
security_scheme = HTTPBearer()

# Pydantic Schemas for Requests & Responses
class UserSignup(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)
    name: str = Field(..., min_length=1, max_length=100)

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
        
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v.lower()

class UserLogin(BaseModel):
    username_or_email: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    name: str
    created_at: str

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

# Authentication Dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> dict:
    """
    Dependency to authenticate requests by validating the Bearer token in the database.
    """
    token = credentials.credentials
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get user linked to the token
    cursor.execute("""
        SELECT u.id, u.username, u.email, u.name, u.created_at, s.expires_at 
        FROM users u 
        JOIN sessions s ON u.id = s.user_id 
        WHERE s.token = ?
    """, (token,))
    user_row = cursor.fetchone()
    conn.close()
    
    if not user_row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Check expiry
    expires_at = datetime.fromisoformat(user_row["expires_at"])
    if expires_at < datetime.now():
        # Delete expired session
        conn = get_db_connection()
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return {
        "id": user_row["id"],
        "username": user_row["username"],
        "email": user_row["email"],
        "name": user_row["name"],
        "created_at": user_row["created_at"]
    }

# Routes
@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup):
    """
    Registers a new user, hashing their password and saving details to SQLite.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if username or email already exists
    cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (user_data.username, user_data.email))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is already registered"
        )
        
    # Hash password
    hashed, salt = hash_password(user_data.password)
    created_at = datetime.now().isoformat()
    
    try:
        cursor.execute("""
            INSERT INTO users (username, email, name, hashed_password, salt, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_data.username, user_data.email, user_data.name, hashed, salt, created_at))
        user_id = cursor.lastrowid
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error during registration"
        )
    
    conn.close()
    
    return {
        "id": user_id,
        "username": user_data.username,
        "email": user_data.email,
        "name": user_data.name,
        "created_at": created_at
    }

@router.post("/login", response_model=LoginResponse)
def login(login_data: UserLogin):
    """
    Authenticates user and generates a persistent session token.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query user by username or email
    cursor.execute("""
        SELECT id, username, email, name, hashed_password, salt, created_at
        FROM users
        WHERE username = ? OR email = ?
    """, (login_data.username_or_email.lower(), login_data.username_or_email.lower()))
    user_row = cursor.fetchone()
    
    if not user_row or not verify_password(login_data.password, user_row["hashed_password"], user_row["salt"]):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )
        
    # Generate session token (valid for 24 hours)
    token = generate_session_token()
    expires_at = (datetime.now() + timedelta(days=1)).isoformat()
    
    cursor.execute("""
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (?, ?, ?)
    """, (token, user_row["id"], expires_at))
    conn.commit()
    conn.close()
    
    return {
        "token": token,
        "user": {
            "id": user_row["id"],
            "username": user_row["username"],
            "email": user_row["email"],
            "name": user_row["name"],
            "created_at": user_row["created_at"]
        }
    }

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user), credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    """
    Logs out the user, invalidating their active session token in the database.
    """
    token = credentials.credentials
    conn = get_db_connection()
    conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """
    Returns the current logged-in user context.
    """
    return current_user
