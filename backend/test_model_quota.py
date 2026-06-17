import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Add parent dir to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

import google.generativeai as genai
from app.services.gemini_service import DialogueSchema

async def main():
    print("Testing generate_tamil_dialogue with gemini-2.0-flash...")
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    
    prompt = """
    You are an expert Tamil language teacher and NLP assistant. 
    Generate a grammatically correct, natural, and educational dialogue in Tamil based on the following input parameters:
    
    1. Scenario/Setting: college
    2. Specific Topic: admission
    3. Tone: formal (e.g. Formal, Informal, Respectful, Friendly)
    4. Exact number of conversational exchanges: 3
    
    For each line of dialogue, you MUST provide:
    - Speaker name in Tamil
    - Tamil text
    - English translation
    
    You must return the dialogue as a JSON object matching the requested schema.
    """
    
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": DialogueSchema,
                "temperature": 0.7
            }
        )
        print("Success! Raw Response text:")
        print(response.text)
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())
