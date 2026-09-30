
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { RoadmapModal } from './RoadmapModal';
import { useState } from 'react';

export function TitleScreen() {
  const store = useGameStore((s: any) => s);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleStart = () => {
    audioManager.playBlipSFX();
    store.startGame();
  };

  const handleReset = () => {
    audioManager.playBlipSFX();
    store.resetGame();
    setShowResetConfirm(false);
  };

  const toggleSound = () => {
    audioManager.playBlipSFX();
    store.toggleSound();
  };

  return (
    <div className="absolute inset-0 bg-[#0c0a09] flex flex-col items-center justify-center p-4">
      {/* Background with CSS fallback if image missing */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b] via-[#581c87] to-[#b45309] opacity-90" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
        style={{ backgroundImage: 'url(/backgrounds/title_bg_clean.png)', imageRendering: 'pixelated' }}
      />
      
      {/* Title */}
      <div className="relative z-10 w-full flex flex-col items-center mt-[-100px] mb-12">
        <h1 className="font-[VT323] text-5xl md:text-6xl text-center text-[#facc15] drop-shadow-[3px_3px_0_#991b1b] leading-tight uppercase">
          MỖI NGÀY<br/>MỘT NGHỀ
        </h1>
        <p className="font-[VT323] text-xl text-[#fef3c7] tracking-widest mt-2 drop-shadow-[2px_2px_0_#000]">
          SINH TỒN VỈA HÈ (16-BIT)
        </p>
      </div>

      {/* Main Actions */}
      <div className="relative z-10 flex flex-col w-full max-w-[280px] gap-4">
        {store.day > 1 ? (
          <button onClick={handleStart} className="pixel-btn-gold font-[VT323] text-2xl py-3 border-b-4 border-[#78350f]">
            TIẾP TỤC (NGÀY {store.day})
          </button>
        ) : (
          <button onClick={handleStart} className="pixel-btn-green font-[VT323] text-2xl py-3 border-b-4 border-[#14532d]">
            BẮT ĐẦU
          </button>
        )}
        
        <button onClick={() => { audioManager.playBlipSFX(); setShowRoadmap(true); }} className="pixel-btn-gray font-[VT323] text-xl py-2">
          NHẬT KÝ SỐ PHẬN
        </button>

        <button onClick={() => { audioManager.playBlipSFX(); setShowResetConfirm(true); }} className="pixel-btn-red font-[VT323] text-xl py-2">
          CHƠI LẠI TỪ ĐẦU
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#fef3c7] border-4 border-[#78350f] p-5 shadow-2xl font-[Share_Tech_Mono] text-[#1c1917] max-w-[320px] w-full text-center">
            <h2 className="font-[VT323] text-2xl text-[#991b1b] mb-4">CẢNH BÁO XÓA DỮ LIỆU</h2>
            <p className="mb-6">Bạn có chắc muốn xóa toàn bộ tiến trình và chơi lại từ đầu?</p>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex-1 bg-[#991b1b] text-white py-2 px-4 border-2 border-[#450a0a] font-[VT323] text-xl">XÓA</button>
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-[#15803d] text-white py-2 px-4 border-2 border-[#14532d] font-[VT323] text-xl">HỦY</button>
            </div>
          </div>
        </div>
      )}

      {showRoadmap && <RoadmapModal onClose={() => setShowRoadmap(false)} />}
      
      {/* Bottom controls */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-10">
        <button onClick={toggleSound} className="font-[VT323] text-lg text-[#fef3c7] bg-[#78350f] px-4 py-1 rounded-full border-2 border-[#3f2010]">
          {store.isSoundOn ? 'BẬT ÂM' : 'TẮT ÂM'}
        </button>
        <button 
          onClick={() => {
            audioManager.playBlipSFX();
            localStorage.removeItem('disclaimer_accepted');
            window.location.reload();
          }} 
          className="font-[VT323] text-sm text-neutral-400 hover:text-white underline decoration-dashed"
        >
          [ XEM LẠI CẢNH BÁO ĐÍNH CHÍNH ]
        </button>
      </div>
    </div>
  );
}
