
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { useEffect } from 'react';

export function GameOverScreen() {
  const store = useGameStore();

  useEffect(() => {
    if (store.isSoundOn) audioManager.playErrorSFX();
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#1a0a0a]">
      <h2 className="font-pixel text-red-400 text-lg tracking-wider mb-1">KẾT THÚC</h2>
      <button onClick={() => store.setStage('DISCLAIMER_POST_GAME')} className="pixel-btn-gold text-sm px-6 py-2.5 w-full tracking-wide">
        ĐỌC TIẾP NHẬT KÝ
      </button>
      <button onClick={() => store.resetGame()} className="pixel-btn-red text-sm px-6 py-2.5 w-full tracking-wide mt-2">
        VỀ MÀN HÌNH CHÍNH
      </button>
    </div>
  );
}
