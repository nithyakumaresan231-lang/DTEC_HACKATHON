import hashlib
import os
import secrets

def hash_password(password: str, salt: bytes = None) -> tuple[str, str]:
    """
    Hashes a password using PBKDF2 with SHA-256 and 100,000 iterations.
    Returns (hashed_password_hex, salt_hex).
    """
    if salt is None:
        salt = os.urandom(16)
    
    hashed = hashlib.pbkdf2_hmac(
        hash_name='sha256',
        password=password.encode('utf-8'),
        salt=salt,
        iterations=100000
    )
    return hashed.hex(), salt.hex()

def verify_password(password: str, hashed_password: str, salt_hex: str) -> bool:
    """
    Verifies a password against a stored hash and salt.
    """
    try:
        salt = bytes.fromhex(salt_hex)
        check_hash, _ = hash_password(password, salt)
        return check_hash == hashed_password
    except Exception:
        return False

def generate_session_token() -> str:
    """
    Generates a cryptographically secure session token.
    """
    return secrets.token_hex(32)
