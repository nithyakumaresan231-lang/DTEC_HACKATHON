from pydantic import BaseModel, Field

class SentenceRequest(BaseModel):
    subject: str = Field(..., description="Subject pronoun (e.g. நான், அவன், அவர்கள்)")
    verb: str = Field(..., description="Root verb (e.g. செல், படி, எழுது)")
    object_name: str = Field(..., alias="object", description="Object noun (e.g. பள்ளி, புத்தகம், கடிதம்)")
    tense: str = Field(..., description="Tense: past, present, or future")

    class Config:
        populate_by_name = True

class SpellCheckRequest(BaseModel):
    sentence: str = Field(..., description="The Tamil sentence containing spelling or sandhi errors to correct")

class DialogueRequest(BaseModel):
    scenario: str = Field(..., description="Setting of the dialogue (e.g. school, hospital, bank, shopping, interview)")
    topic: str = Field(..., description="Topic of the dialogue (e.g. homework, price bargaining, money deposit)")
    tone: str = Field(..., description="Tone: formal, informal, respectful, friendly")
    length: int = Field(5, ge=2, le=15, description="Number of conversation exchanges (2 to 15)")
