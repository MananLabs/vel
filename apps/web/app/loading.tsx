'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING');

  useEffect(() => {
    const statuses = [
      'INITIALIZING',
      'LOADING MODELS',
      'CONNECTING AGENTS',
      'CANVAS READY',
    ];
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const pct = Math.min(frame * 4, 98);
      setProgress(pct);
      if (frame < 8) setStatus(statuses[0]);
      else if (frame < 16) setStatus(statuses[1]);
      else if (frame < 22) setStatus(statuses[2]);
      else setStatus(statuses[3]);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#010101',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <div style={{ fontSize: 14, color: '#FFFFFF', marginBottom: 48, letterSpacing: '0.08em' }}>
        VEL.AI
      </div>

      <div
        style={{
          width: 200,
          height: 2,
          background: 'rgba(255,255,255,0.06)',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#FFFFFF',
            transition: 'width 60ms linear',
          }}
        />
      </div>

      <div
        style={{
          fontSize: 7,
          color: '#333',
          letterSpacing: '0.15em',
        }}
      >
        {status}
      </div>
    </div>
  );
}
