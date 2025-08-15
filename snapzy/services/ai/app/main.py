from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Literal

app = FastAPI(title="Snapzy AI", version="1.0.0")

class ModerationRequest(BaseModel):
	text: str

class ModerationResponse(BaseModel):
	labels: List[str]
	confidence: List[float]

class RecsRequest(BaseModel):
	user_id: int
	limit: int = 20

class RecItem(BaseModel):
	content_kind: Literal['post','reel']
	content_id: int
	score: float

class CaptionRequest(BaseModel):
	media_labels: List[str]

@app.get("/")
async def root():
	return {"ok": True}

@app.post("/moderate", response_model=ModerationResponse)
async def moderate(req: ModerationRequest):
	labels = []
	conf = []
	low = req.text.lower()
	if any(k in low for k in ["hate", "violence", "nsfw"]):
		labels.append("flagged")
		conf.append(0.9)
	return ModerationResponse(labels=labels, confidence=conf)

@app.post("/recs", response_model=List[RecItem])
async def recs(req: RecsRequest):
	return [RecItem(content_kind='post', content_id=i, score=1.0 - i*0.01) for i in range(1, req.limit+1)]

@app.post("/caption")
async def caption(req: CaptionRequest):
	return {"caption": f"{', '.join(req.media_labels)} — captured on Snapzy"}