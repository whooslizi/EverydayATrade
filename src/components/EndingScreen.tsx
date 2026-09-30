import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { ENDINGS } from '../data/gameData';

export function EndingScreen() {
  const store = useGameStore();
  const endingId = store.endingId;
  const ending = endingId ? ENDINGS[endingId] : null;

  const handleContinue = () => {
    audioManager.playBlipSFX();
    // Record unlocked ending
    const current = store.endingsUnlocked || [];
    if (endingId && !current.includes(endingId)) {
      useGameStore.setState({ endingsUnlocked: [...current, endingId] });
    }
    store.setStage('DISCLAIMER_POST_GAME');
  };

  const handleReset = () => {
    audioManager.playBlipSFX();
    store.resetGame();
  };

  if (!ending) {
    return (
      <div className="absolute inset-0 bg-[#0c0a09] flex items-center justify-center">
        <div className="pixel-panel-dark p-6 text-center animate-slide-up">
          <h1 className="font-[VT323] text-3xl text-[#fbc02d] mb-4">KẾT THÚC</h1>
          <button onClick={handleReset} className="pixel-btn pixel-btn-gray font-[VT323] text-lg w-full">
            VỀ MÀN HÌNH CHÍNH
          </button>
        </div>
      </div>
    );
  }

  const moodColors: Record<string, string> = {
    tragic: '#d32f2f',
    bittersweet: '#f57f17',
    comedic: '#fbc02d',
    triumphant: '#15803d',
  };

  return (
    <div className="absolute inset-0 bg-[#0c0a09] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
      <div className="pixel-panel-dark p-6 max-w-[400px] w-full animate-slide-up">
        <h1 className="font-[VT323] text-3xl text-center mb-2"
          style={{ color: moodColors[ending.mood] || '#fbc02d' }}
        >
          {ending.title}
        </h1>
        <p className="font-[Share_Tech_Mono] text-sm text-center text-[#78716c] mb-4 italic">{ending.subtitle}</p>

        <div className="space-y-3 mb-6">
          {ending.story.map((line, i) => (
            <p key={i} className="font-[Share_Tech_Mono] text-sm text-[#f4ecd8] leading-relaxed">{line}</p>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={handleContinue} className="pixel-btn pixel-btn-gold w-full font-[VT323] text-lg">
            DOC TIEP NHẬT KÝ
          </button>
          <button onClick={handleReset} className="pixel-btn pixel-btn-gray w-full font-[VT323] text-lg">
            VỀ MÀN HÌNH CHÍNH
          </button>
        </div>
      </div>
    </div>
  );
}
