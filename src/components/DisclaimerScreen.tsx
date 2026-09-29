// ====== DISCLAIMER SCREEN ======
import { useGameStore } from '../store/useGameStore';
import { DISCLAIMER_TEXT } from '../data/gameData';
import { audioManager } from '../audio/AudioManager';;

export function DisclaimerScreen() {
  const acceptDisclaimer = useGameStore((s) => s.acceptDisclaimer);
  const isSoundOn = useGameStore((s) => s.isSoundOn);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 p-3">
      <div
        className="max-w-[360px] w-full animate-slide-up"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        {/* Parchment scroll */}
        <div className="bg-parchment border-4 border-dark-brown rounded-sm p-4 relative"
          style={{
            boxShadow: 'inset 0 0 30px rgba(60,36,21,0.15), 4px 4px 0 0 rgba(60,36,21,0.3)',
            backgroundImage: 'radial-gradient(ellipse at center, transparent 40%, rgba(60,36,21,0.08) 100%)',
          }}
        >
          {/* Title ribbon */}
          <div className="text-center mb-3">
            <div className="text-sm tracking-[0.15em] text-red-accent font-bold uppercase">
              ️ THÔNG BÁO ️
            </div>
            <div className="text-base text-dark-brown font-bold mt-1">
              MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH
            </div>
          </div>

          {/* Decorative line */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-dark-brown/30" />
            <span className="text-sm text-dark-brown/50"></span>
            <div className="flex-1 h-px bg-dark-brown/30" />
          </div>

          {/* Body text */}
          <p className="text-[9px] leading-[14px] text-dark-brown/90 text-justify mb-4"
            style={{ fontFamily: 'var(--font-game)' }}
          >
            {DISCLAIMER_TEXT}
          </p>

          {/* Seal */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full border-2 border-red-accent/50 flex items-center justify-center text-lg">
              ️
            </div>
          </div>

          {/* Accept button */}
          <button
            onClick={() => {
              if (isSoundOn) audioManager.playBlipSFX();
              acceptDisclaimer();
            }}
            className="pixel-btn-gold w-full text-center text-sm py-3 tracking-wide"
          >
            Tôi Đã Hiểu & Bắt Đầu Bươn Chải
          </button>
        </div>
      </div>
    </div>
  );
}
