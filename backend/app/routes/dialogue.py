from fastapi import APIRouter, HTTPException
from app.models.request_models import DialogueRequest
from app.models.response_models import DialogueResponse
from app.services.gemini_service import generate_tamil_dialogue

router = APIRouter()

@router.post("/generate-dialogue", response_model=DialogueResponse)
async def generate_dialogue_endpoint(req: DialogueRequest):
    """
    Generates a realistic Tamil dialogue using the Gemini API based on a scenario, topic, and tone.
    """
    try:
        dialogue = await generate_tamil_dialogue(
            scenario=req.scenario,
            topic=req.topic,
            tone=req.tone,
            exchanges_count=req.length
        )
        return DialogueResponse(**dialogue)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate dialogue: {str(e)}")
