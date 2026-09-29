// ====== GAME OVER SCREEN ======
import { useGameStore } from '../store/useGameStore';
import { formatVND } from '../data/gameData';
import { audioManager } from '../audio/AudioManager';;
import { useEffect } from 'react';

export function GameOverScreen() {
  const store = useGameStore();

  useEffect(() => {
    if (store.isSoundOn) audioManager.playErrorSFX();
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(180deg, #1a0a0a 0%, #3a0a0a 40%, #1a0a0a 100%)' }}
    >
      {/* Skull */}
      <div className="text-5xl mb-4 animate-shake"></div>

      <h2 className="font-pixel text-red-400 text-lg tracking-wider mb-1"
        style={{ textShadow: '2px 2px 0 #000' }}
      >
        GAME OVER
      </h2>
      <p className="text-[10px] text-red-300/70 font-pixel mb-4">
        CỤ BÁ ĐÃ ĐẾN XIẾT TÀI SẢN
      </p>

      <div className="dialog-box max-w-[300px] w-full mb-4">
        <div className="grid grid-cols-2 gap-1 text-[9px] font-game text-dark-brown/80">
          <div> Ngày cuối:</div>
          <div className="text-right">{store.day}/{store.maxDays}</div>
          <div> Tiền còn:</div>
          <div className="text-right">{formatVND(Math.max(0, store.cash))}</div>
          <div> Nợ còn:</div>
          <div className="text-right text-red-accent">{formatVND(store.debt)}</div>
          <div> Dũng:</div>
          <div className="text-right">
            {store.dog.loyalty > 30 ? 'Vẫn đợi bạn...' : 'Đã bỏ đi '}
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full max-w-[300px]">
        {store.log.length > 0 && (
          <div className="parchment-card max-h-[80px] overflow-y-auto">
            <div className="text-[8px] font-pixel text-dark-brown/50 mb-0.5"> Nhật ký cuối</div>
            {store.log.slice(-4).map((entry, i) => (
              <p key={i} className="text-[8px] text-dark-brown/70 font-game">{entry}</p>
            ))}
          </div>
        )}

        <button
          onClick={() => store.resetGame()}
          className="pixel-btn-red text-[10px] px-6 py-2.5 w-full tracking-wide"
        >
           Chơi Lại
        </button>
      </div>
    </div>
  );
}
