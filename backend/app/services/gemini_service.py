import os
import json
import logging
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env file relative to this file's directory
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    logger.info("Gemini API configured successfully.")
else:
    logger.warning("GEMINI_API_KEY not found in environment. Fallback dialogues will be used.")

# Pre-defined fallbacks for different scenario combinations (expanded to 8 exchanges)
MOCK_DIALOGUES = {
    "school": {
        "title": "பள்ளி உரையாடல் - வீட்டுப்பாடம் (School Dialogue - Homework)",
        "exchanges": [
            {"speaker": "மாணவர்", "tamil": "வணக்கம் ஆசிரியரே.", "english": "Hello Teacher."},
            {"speaker": "ஆசிரியர்", "tamil": "வணக்கம். இன்று வீட்டுப்பாடம் கொண்டு வந்தாயா?", "english": "Hello. Did you bring your homework today?"},
            {"speaker": "மாணவர்", "tamil": "ஆம் ஆசிரியரே, நான் வீட்டுப்பாடத்தை முழுமையாக முடித்துவிட்டேன்.", "english": "Yes teacher, I have completed the homework fully."},
            {"speaker": "ஆசிரியர்", "tamil": "மிகவும் நன்று! உன் குறிப்பேட்டை என்னிடம் காட்டு.", "english": "Very good! Show me your notebook."},
            {"speaker": "மாணவர்", "tamil": "இதோ எனது குறிப்பேடு, ஆசிரியரே. சரிபார்த்துக் கொள்ளுங்கள்.", "english": "Here is my notebook, teacher. Please check it."},
            {"speaker": "ஆசிரியர்", "tamil": "அருமை! அனைத்து விடைகளும் சரியாக உள்ளன.", "english": "Excellent! All the answers are correct."},
            {"speaker": "மாணவர்", "tamil": "நன்றி ஆசிரியரே, நான் மேலும் நன்றாகப் படிப்பேன்.", "english": "Thank you teacher, I will study even better."},
            {"speaker": "ஆசிரியர்", "tamil": "மகிழ்ச்சி, வகுப்பிற்குச் சென்று அமர்.", "english": "Glad, go and sit in the classroom."}
        ]
    },
    "hospital": {
        "title": "மருத்துவமனை உரையாடல் - உடல்நலம் (Hospital Dialogue - Health)",
        "exchanges": [
            {"speaker": "நோயாளி", "tamil": "வணக்கம் மருத்துவரே. எனக்கு இரண்டு நாட்களாக காய்ச்சலாக உள்ளது.", "english": "Hello doctor. I have been having a fever for two days."},
            {"speaker": "மருத்துவர்", "tamil": "வணக்கம். காய்ச்சலுடன் இருமல் அல்லது தலைவலி இருக்கிறதா?", "english": "Hello. Do you have a cough or headache along with the fever?"},
            {"speaker": "நோயாளி", "tamil": "ஆம், லேசான தலைவலி மற்றும் உடல் சோர்வு உள்ளது.", "english": "Yes, I have a mild headache and body fatigue."},
            {"speaker": "மருத்துவர்", "tamil": "நான் பரிசோதிக்கிறேன். சளி ஏதேனும் பிடித்துள்ளதா?", "english": "Let me check you. Do you have a cold?"},
            {"speaker": "நோயாளி", "tamil": "ஆமாம் மருத்துவரே, தொண்டை வலியும் கொஞ்சம் இருக்கிறது.", "english": "Yes doctor, I have a little sore throat too."},
            {"speaker": "மருத்துவர்", "tamil": "சரி, இந்த மாத்திரைகளை மூன்று நாட்கள் காலை மற்றும் இரவு சாப்பிடுங்கள்.", "english": "Okay, take these tablets for three days, morning and night."},
            {"speaker": "நோயாளி", "tamil": "பத்தியம் ஏதேனும் இருக்க வேண்டுமா மருத்துவரே?", "english": "Is there any dietary restriction, doctor?"},
            {"speaker": "மருத்துவர்", "tamil": "ஆம், குளிர்ந்த நீர் மற்றும் எண்ணெயில் பொரித்த உணவுகளைத் தவிர்க்கவும்.", "english": "Yes, avoid cold water and deep-fried foods."}
        ]
    },
    "bank": {
        "title": "வங்கி உரையாடல் - கணக்கு தொடங்குதல் (Bank Dialogue - Opening an Account)",
        "exchanges": [
            {"speaker": "வாடிக்கையாளர்", "tamil": "வணக்கம், நான் ஒரு புதிய சேமிப்புக் கணக்கு தொடங்க வேண்டும்.", "english": "Hello, I want to open a new savings account."},
            {"speaker": "வங்கி அதிகாரி", "tamil": "வணக்கம். உங்களிடம் அடையாளச் சான்று மற்றும் முகவரிச் சான்று உள்ளதா?", "english": "Hello. Do you have proof of identity and proof of address?"},
            {"speaker": "வாடிக்கையாளர்", "tamil": "ஆம், என்னிடம் ஆதார் அட்டை மற்றும் புகைப்படம் உள்ளது.", "english": "Yes, I have an Aadhaar card and photographs."},
            {"speaker": "வங்கி அதிகாரி", "tamil": "நல்லது. இந்த விண்ணப்பப் படிவத்தை நிரப்பி கையெழுத்திடுங்கள்.", "english": "Good. Please fill out this application form and sign it."},
            {"speaker": "வாடிக்கையாளர்", "tamil": "கணக்கு தொடங்க எவ்வளவு குறைந்தபட்சத் தொகை செலுத்த வேண்டும்?", "english": "How much minimum balance should I deposit to open the account?"},
            {"speaker": "வங்கி அதிகாரி", "tamil": "குறைந்தபட்சம் ஆயிரம் ரூபாய் செலுத்த வேண்டும்.", "english": "You need to deposit a minimum of one thousand rupees."},
            {"speaker": "வாடிக்கையாளர்", "tamil": "சரிங்க, பணத்தை இதோ தருகிறேன்.", "english": "Sure, here is the money."},
            {"speaker": "வங்கி அதிகாரி", "tamil": "நன்றி. உங்கள் கணக்கு நாளைக்குள் செயல்படத் தொடங்கும்.", "english": "Thank you. Your account will be activated by tomorrow."}
        ]
    },
    "shopping": {
        "title": "கடை உரையாடல் - காய்கறி வாங்குதல் (Shopping Dialogue - Buying Vegetables)",
        "exchanges": [
            {"speaker": "வாங்குபவர்", "tamil": "வணக்கம், தக்காளி ஒரு கிலோ என்ன விலை?", "english": "Hello, what is the price of tomatoes per kilo?"},
            {"speaker": "விற்பனையாளர்", "tamil": "வணக்கம் ஐயா. தக்காளி ஒரு கிலோ நாற்பது ரூபாய்.", "english": "Hello sir. Tomatoes are forty rupees per kilo."},
            {"speaker": "வாங்குபவர்", "tamil": "விலை கொஞ்சம் அதிகமாக உள்ளது. முப்பது ரூபாய்க்குத் தர முடியுமா?", "english": "The price is a bit high. Can you give it for thirty rupees?"},
            {"speaker": "விற்பனையாளர்", "tamil": "இல்லைங்க ஐயா, இது புதிய தக்காளி, நாற்பது ரூபாய் தான் சரியான விலை.", "english": "No sir, these are fresh tomatoes, forty rupees is the correct price."},
            {"speaker": "வாங்குபவர்", "tamil": "சரி, வெண்டைக்காய் மற்றும் கத்தரிக்காய் என்ன விலை?", "english": "Okay, what are the prices of ladies finger and brinjal?"},
            {"speaker": "விற்பனையாளர்", "tamil": "வெண்டைக்காய் கிலோ முப்பது ரூபாய், கத்தரிக்காய் கிலோ ஐம்பது ரூபாய்.", "english": "Ladies finger is thirty rupees per kilo, brinjal is fifty rupees per kilo."},
            {"speaker": "வாங்குபவர்", "tamil": "நல்லது. அரை கிலோ வெண்டைக்காய் மற்றும் ஒரு கிலோ தக்காளி போடுங்கள்.", "english": "Good. Pack half a kilo of ladies finger and one kilo of tomatoes."},
            {"speaker": "விற்பனையாளர்", "tamil": "சரிங்க ஐயா, மொத்தம் எழுபது ரூபாய் ஆகிறது.", "english": "Sure sir, the total comes to seventy rupees."}
        ]
    },
    "interview": {
        "title": "நேர்காணல் உரையாடல் - வேலை வாய்ப்பு (Interview Dialogue - Job Opportunity)",
        "exchanges": [
            {"speaker": "நேர்காணல் செய்பவர்", "tamil": "வணக்கம், உங்களைப் பற்றி சுருக்கமாகக் கூறுங்கள்.", "english": "Hello, tell me briefly about yourself."},
            {"speaker": "விண்ணப்பதாரர்", "tamil": "வணக்கம் ஐயா. எனது பெயர் கவின். நான் கணினி அறிவியல் முடித்துள்ளேன்.", "english": "Hello sir. My name is Kavin. I have completed computer science."},
            {"speaker": "நேர்காணல் செய்பவர்", "tamil": "நல்லது. இந்த வேலைக்கு நீங்கள் ஏன் விண்ணப்பித்தீர்கள்?", "english": "Good. Why did you apply for this job?"},
            {"speaker": "விண்ணப்பதாரர்", "tamil": "எனது மென்பொருள் திறன்களை மேம்படுத்தவும், உங்கள் நிறுவன வளர்ச்சிக்கு பங்களிக்கவும் விரும்புகிறேன்.", "english": "I want to improve my software skills and contribute to your company's growth."},
            {"speaker": "நேர்காணல் செய்பவர்", "tamil": "உங்களுக்கு என்னென்ன நிரலாக்க மொழிகள் தெரியும்?", "english": "What programming languages do you know?"},
            {"speaker": "விண்ணப்பதாரர்", "tamil": "எனக்கு பைதான், ஜாவாஸ்கிரிப்ட் மற்றும் எச்.டி.எம்.எல் நன்றாகத் தெரியும்.", "english": "I know Python, JavaScript, and HTML very well."},
            {"speaker": "நேர்காணல் செய்பவர்", "tamil": "அருமை. எங்கள் நிறுவனத்தில் வேலை நேரம் பற்றி உங்களுக்குத் தெரியுமா?", "english": "Great. Do you know about the working hours in our company?"},
            {"speaker": "விண்ணப்பதாரர்", "tamil": "ஆம் ஐயா, வாரத்தில் ஐந்து நாட்கள் வேலை என்பதை அறிவேன்.", "english": "Yes sir, I know it is a five-day work week."}
        ]
    },
    "default": {
        "title": "பொதுவான உரையாடல் - தமிழ் கற்றல் (General Dialogue - Learning Tamil)",
        "exchanges": [
            {"speaker": "ஆசிரியர்", "tamil": "வணக்கம்! தமிழ் கற்கத் தயாரா?", "english": "Hello! Ready to learn Tamil?"},
            {"speaker": "மாணவர்", "tamil": "வணக்கம். ஆம், நான் ஆர்வமாக உள்ளேன்.", "english": "Hello. Yes, I am very interested."},
            {"speaker": "ஆசிரியர்", "tamil": "மிகவும் மகிழ்ச்சி. தினமும் பயிற்சி செய்வது முக்கியம்.", "english": "Very glad. Practicing daily is important."},
            {"speaker": "மாணவர்", "tamil": "நிச்சயமாக, நான் தினமும் புதிய வாக்கியங்களை எழுதுவேன்.", "english": "Surely, I will write new sentences daily."},
            {"speaker": "ஆசிரியர்", "tamil": "அருமை! உங்களால் எளிதாகக் கற்றுக்கொள்ள முடியும்.", "english": "Excellent! You can learn it easily."},
            {"speaker": "மாணவர்", "tamil": "மிக்க நன்றி ஆசிரியரே, நான் நாளை சந்திக்கிறேன்.", "english": "Thank you very much teacher, I will meet you tomorrow."},
            {"speaker": "ஆசிரியர்", "tamil": "நல்வாழ்த்துகள். போயிட்டு வாருங்கள்.", "english": "Best wishes. Goodbye."},
            {"speaker": "மாணவர்", "tamil": "வணக்கம்.", "english": "Goodbye."}
        ]
    }
}

from typing import List
import pydantic

# Pydantic Schemas for Gemini Structured JSON Output
class DialogueExchangeSchema(pydantic.BaseModel):
    speaker: str = pydantic.Field(description="Role or name of the speaker in Tamil, e.g., 'மாணவர்', 'ஆசிரியர்', 'மருத்துவர்'")
    tamil: str = pydantic.Field(description="The dialogue line written in Tamil script. Follow standard grammar and sandhi doubling rules.")
    english: str = pydantic.Field(description="English translation of the Tamil dialogue line.")

class DialogueSchema(pydantic.BaseModel):
    title: str = pydantic.Field(description="A short English title for the dialogue scenario, e.g., 'School Homework Dialogue'")
    exchanges: List[DialogueExchangeSchema] = pydantic.Field(description="List of consecutive dialogue exchanges.")

class SubjectDetailSchema(pydantic.BaseModel):
    word: str = pydantic.Field(description="The Tamil subject pronoun or noun used, e.g., 'அவன்'")
    meaning: str = pydantic.Field(description="English meaning of the subject word, e.g., 'He'")
    person: str = pydantic.Field(description="Grammatical person, e.g., '1st', '2nd', '3rd'")
    gender: str = pydantic.Field(description="Gender of the subject, e.g., 'Masculine', 'Feminine', 'Neuter'")
    number: str = pydantic.Field(description="Grammatical number, e.g., 'Singular', 'Plural'")

class ObjectDetailSchema(pydantic.BaseModel):
    root: str = pydantic.Field(description="Root form of the object in Tamil, e.g., 'பள்ளி'")
    meaning: str = pydantic.Field(description="English meaning of the object, e.g., 'School'")
    declined: str = pydantic.Field(description="The object declined with the appropriate Tamil case suffix, e.g., 'பள்ளிக்கு'")
    sandhi_applied: str = pydantic.Field(description="The declined object with Sandhi applied at the end if applicable, e.g., 'பள்ளிக்குச்'")
    case_type: str = pydantic.Field(description="Type of grammatical case used, e.g., 'Dative (4th case)'")

class VerbDetailSchema(pydantic.BaseModel):
    root: str = pydantic.Field(description="Root form of the verb in Tamil, e.g., 'செல்'")
    meaning: str = pydantic.Field(description="English meaning of the verb root, e.g., 'Go'")
    tense: str = pydantic.Field(description="The tense requested, e.g., 'Past', 'Present', 'Future'")
    conjugated: str = pydantic.Field(description="The verb conjugated to match the subject and tense, e.g., 'சென்றான்'")
    suffix: str = pydantic.Field(description="The conjugation suffix added to the verb, e.g., '-ஆன்'")

class SandhiDetailSchema(pydantic.BaseModel):
    consonant_doubled: str = pydantic.Field(description="The sandhi consonant that was doubled, e.g., 'ச்', or 'None'")
    explanation: str = pydantic.Field(description="Brief explanation of the sandhi doubling rule applied, e.g., 'Consonant doubled after dative case suffix'")

class CustomSentenceSchema(pydantic.BaseModel):
    subject: SubjectDetailSchema = pydantic.Field(description="Detailed grammatical analysis of the subject.")
    object: ObjectDetailSchema = pydantic.Field(description="Detailed grammatical analysis of the object.")
    verb: VerbDetailSchema = pydantic.Field(description="Detailed grammatical analysis of the verb.")
    sandhi: SandhiDetailSchema = pydantic.Field(description="Grammatical analysis of the sandhi applied.")
    full_sentence: str = pydantic.Field(description="The complete constructed Tamil sentence, e.g., 'அவன் பள்ளிக்குச் சென்றான்.'")


def safe_log_text(text: str) -> str:
    """
    Escapes non-ASCII characters for safe console logging on systems
    with limited encoding support (like CP1252 on Windows).
    """
    return text.encode('ascii', errors='backslashreplace').decode('ascii')


def clean_and_parse_json(text: str) -> dict:
    """
    Cleans up any markdown code block formatting from Gemini responses
    and parses the result as JSON.
    If parsing fails, logs the raw response and highlights the exact malformed line.
    """
    text = text.strip()
    
    # Remove markdown code fences if present
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        logger.error("JSON parsing failed! Details:")
        logger.error(f"  Error message: {e.msg}")
        logger.error(f"  Line: {e.lineno}, Column: {e.colno}, Char Position: {e.pos}")
        
        lines = text.splitlines()
        start_line = max(0, e.lineno - 5)
        end_line = min(len(lines), e.lineno + 5)
        
        err_msg = ["--- Context around the malformed JSON line ---"]
        for idx in range(start_line, end_line):
            line_num = idx + 1
            if idx < len(lines):
                line_content = lines[idx]
                if line_num == e.lineno:
                    err_msg.append(f"-> {line_num:4d} | {safe_log_text(line_content)}")
                    # Estimate pointer position
                    pointer = " " * (e.colno - 1 + 9)  # 9 chars prefix: "-> 1234 | "
                    err_msg.append(f"{pointer}^--- ERROR: {e.msg}")
                else:
                    err_msg.append(f"   {line_num:4d} | {safe_log_text(line_content)}")
        err_msg.append("---------------------------------------------")
        logger.error("\n".join(err_msg))
        raise


AVAILABLE_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash"
]

def generate_content_with_fallback(prompt: str, response_schema=None, temperature: float = 0.7) -> str:
    """
    Attempts content generation using the Gemini API across a list of fallback models.
    This resolves daily rate limit quota exhaustions on specific models (like gemini-2.5-flash).
    """
    last_err = None
    for model_name in AVAILABLE_MODELS:
        try:
            logger.info(f"Attempting content generation with model: {model_name}")
            model = genai.GenerativeModel(model_name)
            
            gen_config = {
                "response_mime_type": "application/json",
                "temperature": temperature
            }
            if response_schema is not None:
                gen_config["response_schema"] = response_schema
                
            response = model.generate_content(
                prompt,
                generation_config=gen_config
            )
            
            if not response:
                raise ValueError("Received completely empty response object from Gemini API.")
                
            try:
                response_text = response.text
            except ValueError as val_err:
                logger.error(f"Failed to extract text from response for model {model_name}: {val_err}")
                if hasattr(response, "prompt_feedback"):
                    logger.error(f"Prompt feedback: {safe_log_text(str(response.prompt_feedback))}")
                if response.candidates:
                    logger.error(f"Candidate finish reason: {response.candidates[0].finish_reason}")
                raise ValueError(f"Gemini response did not contain text. Finish reason: {response.candidates[0].finish_reason if response.candidates else 'Unknown'}") from val_err

            logger.warning(f"Raw Gemini response from model {model_name} (length={len(response_text)}):\n{safe_log_text(response_text)}")
            return response_text
        except Exception as e:
            last_err = e
            logger.warning(f"Model {model_name} failed: {safe_log_text(str(e))}. Trying next fallback model...")
    raise last_err

async def generate_tamil_dialogue(
    scenario: str,
    topic: str,
    tone: str,
    exchanges_count: int
) -> dict:

    dialogue = MOCK_DIALOGUES.get(
        scenario.lower(),
        MOCK_DIALOGUES["default"]
    )

    return {
        "title": dialogue["title"],
        "exchanges": dialogue["exchanges"][:exchanges_count]
    }

_custom_sentence_cache = {}

async def generate_custom_sentence_and_explanation(subject: str, verb: str, object_name: str, tense: str) -> dict:
    """
    Uses Gemini to construct a grammatically correct Tamil sentence from custom inputs
    and break down the grammar. Caches results in memory to optimize subsequent requests.
    """
    if not api_key:
        raise ValueError("தனிப்பயன் வாக்கியங்களை உருவாக்க Gemini API சாவி தேவை. (GEMINI_API_KEY is not configured in .env. Custom inputs require Gemini API.)")
        
    cache_key = (subject, verb, object_name, tense)
    if cache_key in _custom_sentence_cache:
        logger.info(f"Serving custom sentence from cache for key: {cache_key}")
        return _custom_sentence_cache[cache_key]
        
    prompt = f"""
    You are an expert Tamil grammarian and NLP assistant.
    Construct a grammatically correct, natural Tamil sentence from these inputs:
    1. Subject: {subject}
    2. Verb (root): {verb}
    3. Object (root): {object_name}
    4. Tense: {tense} (past, present, or future)
    
    The sentence structure should follow standard Tamil grammar: Subject + Object (properly declined with case suffix) + Verb (conjugated according to subject gender, person, number, and tense).
    Also, apply correct Sandhi consonant doubling rules (e.g. adding 'க்', 'ச்', 'த்', 'ப்') at word boundaries if applicable.
    
    The generated JSON object MUST conform to the schema and contain exactly these keys:
    - "subject": An object with:
      - "word": The Tamil subject pronoun or noun used.
      - "meaning": English meaning of the subject word.
      - "person": Grammatical person ("1st", "2nd", "3rd").
      - "gender": Gender of the subject ("Masculine", "Feminine", "Neuter").
      - "number": Grammatical number ("Singular", "Plural").
    - "object": An object with:
      - "root": Root form of the object in Tamil.
      - "meaning": English meaning of the object.
      - "declined": The object declined with the case suffix.
      - "sandhi_applied": The declined object with Sandhi applied at the end if applicable.
      - "case_type": Type of case used.
    - "verb": An object with:
      - "root": Root form of the verb in Tamil.
      - "meaning": English meaning of the verb root.
      - "tense": Tense requested ("Past", "Present", "Future").
      - "conjugated": The verb conjugated to match subject and tense.
      - "suffix": Conjugation suffix.
    - "sandhi": An object with:
      - "consonant_doubled": The sandhi consonant doubled, or "None".
      - "explanation": Brief explanation of the sandhi doubling rule.
    - "full_sentence": The complete constructed Tamil sentence.
    
    Return the output strictly matching the requested schema.
    Do not add extra text. Return ONLY valid JSON.
    """
    
    try:
        response_text = generate_content_with_fallback(prompt, temperature=0.3)
        res = clean_and_parse_json(response_text)
        _custom_sentence_cache[cache_key] = res
        return res
    except Exception as e:
        logger.error(f"Error generating custom sentence: {str(e)}")
        raise ValueError(f"Failed to generate custom sentence: {str(e)}")

