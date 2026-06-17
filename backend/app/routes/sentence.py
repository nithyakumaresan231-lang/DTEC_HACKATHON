from fastapi import APIRouter, HTTPException
from app.models.request_models import SentenceRequest, SpellCheckRequest
from app.models.response_models import SentenceResponse, GrammarExplanationResponse, SpellCheckResponse
from app.services import grammar_engine, spell_checker

router = APIRouter()

@router.post("/generate-sentence", response_model=SentenceResponse)
async def generate_sentence_endpoint(req: SentenceRequest):
    """
    Constructs a grammatically correct Tamil sentence from subject, object, verb, and tense.
    """
    try:
        from app.data.grammar_rules import PRONOUNS, VERBS, OBJECTS
        # Check if all inputs are predefined locally
        is_local = (req.subject in PRONOUNS) and (req.verb in VERBS) and (req.object_name in OBJECTS)
        
        if is_local:
            sentence = grammar_engine.generate_sentence(
                subject=req.subject,
                verb=req.verb,
                object_name=req.object_name,
                tense=req.tense
            )
        else:
            from app.services.gemini_service import generate_custom_sentence_and_explanation
            res = await generate_custom_sentence_and_explanation(
                subject=req.subject,
                verb=req.verb,
                object_name=req.object_name,
                tense=req.tense
            )
            sentence = res.get("full_sentence", "")
            
        return SentenceResponse(sentence=sentence)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/grammar-explanation", response_model=GrammarExplanationResponse)
async def grammar_explanation_endpoint(req: SentenceRequest):
    """
    Generates a breakdown of grammatical rules used to form the sentence.
    """
    try:
        from app.data.grammar_rules import PRONOUNS, VERBS, OBJECTS
        # Check if all inputs are predefined locally
        is_local = (req.subject in PRONOUNS) and (req.verb in VERBS) and (req.object_name in OBJECTS)
        
        if is_local:
            explanation = grammar_engine.generate_explanation(
                subject=req.subject,
                verb=req.verb,
                object_name=req.object_name,
                tense=req.tense
            )
        else:
            from app.services.gemini_service import generate_custom_sentence_and_explanation
            explanation = await generate_custom_sentence_and_explanation(
                subject=req.subject,
                verb=req.verb,
                object_name=req.object_name,
                tense=req.tense
            )
            
        return GrammarExplanationResponse(**explanation)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/spell-correct", response_model=SpellCheckResponse)
async def spell_correct_endpoint(req: SpellCheckRequest):
    """
    Corrects spelling mistakes and missing sandhi rules in the Tamil sentence.
    """
    try:
        corrected = spell_checker.correct_sentence(req.sentence)
        corrected_flag = (corrected.strip() != req.sentence.strip())
        return SpellCheckResponse(
            original=req.sentence,
            corrected=corrected,
            corrected_flag=corrected_flag
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
