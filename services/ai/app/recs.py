from fastapi import APIRouter
from pydantic import BaseModel
from .main import _model
import numpy as np

router = APIRouter()

class RecsIn(BaseModel):
    user_text: str
    candidate_captions: list[str]

@router.post("/recs")
def recs(inp: RecsIn):
    assert _model is not None
    user_vec = _model.encode([inp.user_text])[0]
    cand_vecs = _model.encode(inp.candidate_captions)
    sims = (cand_vecs @ user_vec) / (
        (np.linalg.norm(cand_vecs, axis=1) * (np.linalg.norm(user_vec) + 1e-9)) + 1e-9
    )
    ranked = sorted(zip(inp.candidate_captions, sims.tolist()), key=lambda x: x[1], reverse=True)
    safe = [c for c, s in ranked if 'nsfw' not in c.lower() and 'spam' not in c.lower()]
    return {"ranked": ranked[:20], "safe": safe[:20]}