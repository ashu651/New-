'use client';
import { useEffect, useState } from 'react';

export default function ExploreSettings() {
  const [novelty, setNovelty] = useState(0.5);
  const [proximity, setProximity] = useState(0.5);
  const [expertise, setExpertise] = useState(0.5);
  const [safety, setSafety] = useState(0.8);

  useEffect(() => { /* Could persist to API or localStorage */ }, [novelty, proximity, expertise, safety]);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Explore Preferences</h1>
      <div>
        <label>Novelty {Math.round(novelty*100)}%</label>
        <input type="range" min={0} max={1} step={0.01} value={novelty} onChange={e=>setNovelty(Number(e.target.value))} />
      </div>
      <div>
        <label>Proximity {Math.round(proximity*100)}%</label>
        <input type="range" min={0} max={1} step={0.01} value={proximity} onChange={e=>setProximity(Number(e.target.value))} />
      </div>
      <div>
        <label>Expertise {Math.round(expertise*100)}%</label>
        <input type="range" min={0} max={1} step={0.01} value={expertise} onChange={e=>setExpertise(Number(e.target.value))} />
      </div>
      <div>
        <label>Safety {Math.round(safety*100)}%</label>
        <input aria-label="Safety" type="range" min={0} max={1} step={0.01} value={safety} onChange={e=>setSafety(Number(e.target.value))} />
      </div>
    </main>
  );
}