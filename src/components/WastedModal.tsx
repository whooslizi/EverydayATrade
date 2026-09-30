
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { ENDINGS } from '../data/gameData';

export function WastedModal() {
  const store = useGameStore((s: any) => s);
  const [phase, setPhase] = useState<'shake' | 'unlocked' | 'options'>('shake');

  useEffect(() => {
    audioManager.playWastedHit();
    const t1 = setTimeout(() => setPhase('unlocked'), 1500);
    const t2 = setTimeout(() => setPhase('options'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-4 transition-all duration-1000 ${phase === 'shake' ? 'bg-black/40 backdrop-grayscale' : 'bg-black/90'}`}>
      
      {phase === 'shake' && (
        <div className="animate-shake w-full bg-[#991b1b] border-y-4 border-[#450a0a] py-6 text-center shadow-[0_0_30px_rgba(153,27,27,0.8)]">
          <h1 className="font-[VT323] text-5xl text-white tracking-widest drop-shadow-[3px_3px_0_#000]">
            {store.endingId === 'ENDING_7_SOLD_DOG' ? 'THẤT BẠI THẢM HẠI: BÁN BẠN CẦU VINH' : 'THẤT BẠI THẢM HẠI'}
          </h1>
        </div>
      )}

      {phase === 'unlocked' && (
        <div className="animate-pulse w-full bg-[#facc15] border-y-4 border-[#ca8a04] py-4 text-center">
          <h2 className="font-[VT323] text-3xl text-[#78350f] drop-shadow-[2px_2px_0_#fff]">
            MỞ KHÓA MẢNH KÝ ỨC
          </h2>
          <p className="font-[Share_Tech_Mono] text-[#78350f] font-bold mt-1 text-[15px]">(PROLOGUE UNLOCKED)</p>
        </div>
      )}

      {phase === 'options' && (
        <div className="bg-[#fef3c7] border-4 border-[#78350f] p-5 w-full max-w-[320px] shadow-2xl animate-slide-up flex flex-col gap-3">
          {store.endingId && ENDINGS[store.endingId as keyof typeof ENDINGS]?.story.map((s, i) => (
            <p key={i} className="font-[Share_Tech_Mono] text-[15px] text-[#1c1917] italic text-center mb-2">
              {s}
            </p>
          ))}
          <h2 className="font-[VT323] text-3xl text-center text-[#991b1b] mb-2 border-b-2 border-[#78350f] pb-2">KẾT CỤC</h2>
          <button 
            onClick={() => store.setStage('DISCLAIMER_POST_GAME')} 
            className="bg-[#15803d] hover:bg-[#166534] text-white py-2 px-4 border-2 border-[#14532d] font-[VT323] text-xl w-full"
          >
            ĐỌC TIẾP NHẬT KÝ
          </button>
          <button 
            onClick={() => store.resetGame()} 
            className="bg-[#991b1b] hover:bg-[#b91c1c] text-white py-2 px-4 border-2 border-[#450a0a] font-[VT323] text-xl w-full"
          >
            VỀ MÀN HÌNH CHÍNH
          </button>
        </div>
      )}
    </div>
  );
}
