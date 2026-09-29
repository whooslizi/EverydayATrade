// ====== ENDING SCREEN ======
import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { ENDINGS } from '../data/gameData';
import { audioManager } from '../audio/AudioManager';;
import { DISCLAIMER_TEXT } from '../data/gameData';
import { useEffect } from 'react';

export function EndingScreen() {
  const store = useGameStore();
  const [lineIdx, setLineIdx] = useState(0);
  const [showCredits, setShowCredits] = useState(false);

  const endingId = store.endingId;
  if (!endingId) return null;

  const ending = ENDINGS[endingId];
  const isLast = lineIdx >= ending.story.length - 1;
  const allShown = lineIdx >= ending.story.length;

  useEffect(() => {
    if (ending.mood === 'triumphant' || ending.mood === 'comedic') {
      if (store.isSoundOn) audioManager.playWinSFX();
    } else {
      if (store.isSoundOn) audioManager.playErrorSFX();
    }
  }, []);

  const advance = () => {
    if (store.isSoundOn) audioManager.playBlipSFX();
    if (isLast) {
      setLineIdx(ending.story.length); // Show all + replay btn
    } else {
      setLineIdx(lineIdx + 1);
    }
  };

  const moodBg: Record<string, string> = {
    tragic: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    bittersweet: 'linear-gradient(180deg, #1a1a2e 0%, #2d1b4e 30%, #4a2c6e 60%, #fde68a22 100%)',
    comedic: 'linear-gradient(180deg, #92400e 0%, #d97706 40%, #fbbf24 80%, #fde68a 100%)',
    triumphant: 'linear-gradient(180deg, #d4a637 0%, #f59e0b 30%, #fde68a 60%, #fff 100%)',
  };

  const moodEmoji: Record<string, string> = {
    tragic: '',
    bittersweet: '',
    comedic: '',
    triumphant: '',
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-4"
      style={{ background: moodBg[ending.mood] || moodBg.tragic }}
    >
      {/* Ending badge */}
      <div className="text-center mb-4 animate-slide-up">
        <div className="text-4xl mb-2">{moodEmoji[ending.mood]}</div>
        <h2 className="font-pixel text-parchment text-sm tracking-wider mb-1"
          style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
        >
          {ending.title}
        </h2>
        <p className="text-[9px] text-parchment/60 font-pixel">{ending.subtitle}</p>
      </div>

      {/* Story text */}
      <div className="dialog-box max-w-[330px] w-full animate-slide-up">
        {!allShown ? (
          <>
            <p className="text-dark-brown text-sm leading-relaxed font-game text-center min-h-[50px] flex items-center justify-center">
              {ending.story[lineIdx]}
            </p>
            <div className="mt-3 flex justify-center">
              <button
                onClick={advance}
                className={`${isLast ? 'pixel-btn-gold' : 'pixel-btn'} text-sm px-6 py-2`}
              >
                {isLast ? ' Kết' : ' Tiếp...'}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {ending.story.map((line, i) => (
              <p key={i} className="text-dark-brown text-[9px] leading-relaxed font-game">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Stats & Replay */}
      {allShown && !showCredits && (
        <div className="mt-4 space-y-2 animate-slide-up w-full max-w-[330px]">
          <div className="parchment-card">
            <div className="text-[9px] font-pixel text-dark-brown mb-1"> Thống Kê</div>
            <div className="grid grid-cols-2 gap-1 text-sm font-game text-dark-brown/70">
              <div>Ngày sinh tồn:</div>
              <div className="text-right">{store.day}/{store.maxDays}</div>
              <div>Lần bị bắt:</div>
              <div className="text-right">{store.timesArrested}</div>
              <div>Ngày bán lương thiện:</div>
              <div className="text-right">{store.totalHonestDays}</div>
              <div>Ngày chặt chém:</div>
              <div className="text-right">{store.totalCheatingDays}</div>
            </div>
          </div>

          <button
            onClick={() => setShowCredits(true)}
            className="pixel-btn-gold text-sm px-6 py-2.5 w-full tracking-wide"
          >
             Xem Credits & Đính Chính
          </button>
        </div>
      )}

      {/* Memorial Credits & Disclaimer */}
      {showCredits && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center p-4 overflow-y-auto animate-fade-in">
          <div className="max-w-[360px] w-full text-center space-y-6 mt-10">
            <div className="font-pixel text-gold-accent text-[12px] tracking-widest border-y-2 border-gold-accent py-2">
              GAME COMPLETED
            </div>
            
            <div className="space-y-2">
              <div className="font-pixel text-parchment text-sm">Credits:</div>
              <div className="font-game text-parchment/80 text-sm">Lead Developer & Story: You</div>
              <div className="font-game text-parchment/80 text-sm">Pixel Art & Sound Architecture: Built with ️</div>
            </div>

            <div className="font-game text-red-accent/90 text-base italic mt-8">
              In loving memorial for grandpa ️
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-dark-brown/50">
              <div className="text-[9px] font-pixel text-red-accent mb-2">️ THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH:</div>
              <p className="text-sm font-game text-parchment/60 text-justify leading-relaxed">
                {DISCLAIMER_TEXT}
              </p>
            </div>

            <button
              onClick={() => store.resetGame()}
              className="pixel-btn-gold text-sm px-6 py-2.5 w-full tracking-wide mt-8 mb-10"
            >
               Chơi Lại Từ Đầu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
