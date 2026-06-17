from pydantic import BaseModel
from typing import List, Optional

class SentenceResponse(BaseModel):
    sentence: str

class SubjectDetail(BaseModel):
    word: str
    meaning: str
    person: str
    gender: str
    number: str

class ObjectDetail(BaseModel):
    root: str
    meaning: str
    declined: str
    sandhi_applied: str
    case_type: str

class VerbDetail(BaseModel):
    root: str
    meaning: str
    tense: str
    conjugated: str
    suffix: str

class SandhiDetail(BaseModel):
    consonant_doubled: str
    explanation: str

class GrammarExplanationResponse(BaseModel):
    subject: SubjectDetail
    object: ObjectDetail
    verb: VerbDetail
    sandhi: SandhiDetail
    full_sentence: str

class SpellCheckResponse(BaseModel):
    original: str
    corrected: str
    corrected_flag: bool

class DialogueExchange(BaseModel):
    speaker: str
    tamil: str
    english: str

class DialogueResponse(BaseModel):
    title: str
    exchanges: List[DialogueExchange]
