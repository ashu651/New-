import { Body, Controller, Post } from '@nestjs/common';
import fetch from 'cross-fetch';

@Controller('recs')
export class RecsController {
  @Post()
  async recommend(@Body() body: { userText: string; candidateCaptions: string[] }) {
    const aiBase = process.env.AI_BASE_URL || 'http://localhost:5000';
    const res = await fetch(`${aiBase}/recs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_text: body.userText, candidate_captions: body.candidateCaptions })
    });
    const data = (await res.json()) as { ranked: [string, number][]; safe: string[] };
    // Simple blending with quality score placeholder
    const blended = data.ranked.map(([caption, score]) => ({ caption, score: score * 0.7 + 0.3 }));
    return { results: blended.slice(0, 20), safe: data.safe };
  }
}