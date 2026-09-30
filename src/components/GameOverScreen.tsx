import useGameStore from '../store/useGameStore';

export default function GameOverScreen() {
  const setStage = useGameStore((s) => s.setStage);
  const resetGame = useGameStore((s) => s.resetGame);
  const gameLog = useGameStore((s) => s.gameLog);

  const recentEntries = gameLog.slice(-3);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0c0a09] p-4">
      <div className="pixel-panel-dark max-w-lg w-full animate-slide-up">
        <h1 className="font-[VT323] text-4xl text-[#d32f2f] text-center mb-4">
          KẾT THÚC
        </h1>

        {recentEntries.length > 0 && (
          <div className="mb-6 space-y-1">
            {recentEntries.map((entry, i) => (
              <p
                key={i}
                className="font-[Share_Tech_Mono] text-xs text-[#a09080] leading-relaxed"
              >
                {entry}
              </p>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            className="pixel-btn-gold w-full"
            onClick={() => setStage('DISCLAIMER_POST_GAME')}
          >
            DOC TIEP NHẬT KÝ
          </button>
          <button
            className="pixel-btn-gray w-full"
            onClick={() => resetGame()}
          >
            VỀ MÀN HÌNH CHÍNH
          </button>
        </div>
      </div>
    </div>
  );
}
