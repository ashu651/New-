from fastapi import FastAPI, Body
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import os

app = FastAPI(title="Snapzy AI")

from .recs import router as recs_router
app.include_router(recs_router)

_model_name = os.getenv("SENTENCE_TRANSFORMERS_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
_model: SentenceTransformer | None = None

@app.on_event("startup")
def load_model():
    global _model
    _model = SentenceTransformer(_model_name)

class TextIn(BaseModel):
    text: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/embeddings")
def embeddings(inp: TextIn):
    assert _model is not None
    vec = _model.encode([inp.text])[0].tolist()
    return {"vector": vec}

@app.post("/moderate")
def moderate(inp: TextIn):
    text = inp.text.lower()
    flags = {
        "hate": any(k in text for k in ["hate", "slur"]),
        "spam": any(k in text for k in ["buy now", "free $$$"]),
        "nsfw": any(k in text for k in ["nsfw", "nude"]) ,
    }
    severity = sum(1 for v in flags.values() if v)
    decision = "allow" if severity == 0 else ("review" if severity == 1 else "block")
    return {"flags": flags, "decision": decision}

@app.post("/caption")
def caption():
    return {"caption": "A beautiful day at the beach #sunset"}