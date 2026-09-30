
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function DisclaimerScreen() {
  const setStage = useGameStore((s) => s.setStage);
  const isSoundOn = useGameStore((s) => s.isSoundOn);

  const agree = () => {
    if (isSoundOn) audioManager.playBlipSFX();
    setStage('MEMORIAL');
  };

  const disagree = () => {
    if (isSoundOn) audioManager.playBlipSFX();
    setStage('TITLE');
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#1a1414]/90 z-50 p-4 font-sans select-none">
      <div className="pixel-panel w-full max-w-[380px] h-[80%] flex flex-col items-center animate-slide-up relative">
        <h1 className="text-[20px] font-black mb-4 text-center text-[#ff6b6b] uppercase tracking-wide">
          THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH
        </h1>
        <p className="text-center font-medium mb-6 text-[14px] leading-relaxed text-[#e8dcdc] text-justify">
          Trò chơi 'Mỗi Ngày Một Nghề' là sản phẩm hư cấu hoàn toàn, phục vụ mục đích giải trí...
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={agree} className="flex-1 pixel-btn-red text-lg">TÔI ĐỒNG TÌNH</button>
          <button onClick={disagree} className="flex-1 pixel-btn-gray text-lg">TÔI KHÔNG ĐỒNG TÌNH</button>
        </div>
      </div>
    </div>
  );
}
