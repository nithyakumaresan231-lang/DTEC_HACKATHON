import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routes import sentence, dialogue, auth
from app.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    yield

app = FastAPI(
    title="Tamil Dialogue & Sentence Builder API",
    description="An educational NLP FastAPI backend for Tamil grammar, sentence construction, and AI dialogue generation.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL (e.g. Vercel deployment)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(sentence.router, prefix="/api", tags=["Sentence Builder"])
app.include_router(dialogue.router, prefix="/api", tags=["Dialogue Generator"])

@app.get("/health")
@app.get("/api/health")
async def health_check():
    """
    Service health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "Tamil Dialogue & Sentence Builder API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
