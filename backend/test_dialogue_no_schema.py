import os
import sys
import json
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Add parent dir to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

import google.generativeai as genai

async def main():
    print("Testing gemini-3.5-flash WITHOUT response_schema...")
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    
    prompt = """
    You are an expert Tamil language teacher and NLP assistant. 
    Generate a grammatically correct, natural, and educational dialogue in Tamil based on the following input parameters:
    
    1. Scenario/Setting: college
    2. Specific Topic: admission
    3. Tone: formal (e.g. Formal, Informal, Respectful, Friendly)
    4. Exact number of conversational exchanges: 3 (an exchange is one speaker speaking once)
    
    For each line of dialogue, you MUST provide:
    - Speaker name in Tamil (representing the characters appropriate for the scenario, e.g. 'அதிகாரி' and 'மாணவர்')
    - Tamil text: The actual dialogue line in Tamil script.
    - English translation: A clear and natural English translation of that line.
    
    You must return the dialogue STRICTLY as a JSON object conforming to the following structure:
    {
      "title": "College Admission Inquiry - கல்லூரி சேர்க்கை",
      "exchanges": [
        {
          "speaker": "மாணவர்",
          "tamil": "வணக்கம் ஐயா, எனக்கு சேர்க்கை விவரங்கள் வேண்டும்.",
          "english": "Hello sir, I need admission details."
        },
        ...
      ]
    }
    
    Do not add any markdown formatting (like ```json) outside the JSON output. 
    Do not add extra text, preamble, or epilogue. Return ONLY valid JSON.
    """
    
    try:
        model = genai.GenerativeModel("gemini-3.5-flash")
        response = model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.7
            }
        )
        
        # Test loading it
        parsed = json.loads(response.text)
        print("Success! JSON parsed correctly!")
        
        # Write to file
        with open("dialogue_res_no_schema.json", "w", encoding="utf-8") as f:
            json.dump(parsed, f, ensure_ascii=False, indent=2)
        print("Saved to dialogue_res_no_schema.json")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(main())
