import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function WastedTransition() {
  const stage = useGameStore(s => s.stage);
  const [phase, setPhase] = useState<'idle' | 'shake' | 'banner' | 'badge'>('idle');

  useEffect(() => {
    if (stage !== 'GAME_OVER') {
      setPhase('idle');
      return;
    }
    // Phase 1: Shake + desaturate
    setPhase('shake');
    audioManager.playWastedHit();

    const t1 = setTimeout(() => setPhase('banner'), 600);
    const t2 = setTimeout(() => setPhase('badge'), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [stage]);

  if (phase === 'idle') return null;

  return (
    <div className={`absolute inset-0 z-[60] flex items-center justify-center ${phase === 'shake' ? 'animate-shake' : ''}`}
      style={{ filter: (phase as string) !== 'idle' ? 'grayscale(80%) contrast(120%)' : 'none' }}
    >
      <div className="absolute inset-0 bg-black/60" />

      {(phase === 'banner' || phase === 'badge') && (
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="bg-[#991b1b] border-4 border-[#450a0a] px-8 py-4 animate-slam-in">
            <h1 className="font-[VT323] text-4xl text-white pixel-text-shadow uppercase tracking-widest">
              THẤT BẠI THẢM HẠI
            </h1>
          </div>

          {phase === 'badge' && (
            <div className="bg-[#fbc02d] border-4 border-[#78350f] px-6 py-3 animate-slide-up text-center">
              <p className="font-[VT323] text-lg text-[#3e2723] uppercase">
                MỞ KHÓA MẢNH KÝ ỨC
              </p>
              <p className="font-[Share_Tech_Mono] text-sm text-[#78350f] mt-1">
                Vết Sẹo Vỉa Hè
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
