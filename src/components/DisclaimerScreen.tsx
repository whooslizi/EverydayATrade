
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function DisclaimerScreen() {
  const store = useGameStore();
  

  const agree = () => {
    if (store.isSoundOn) audioManager.playBlipSFX();
    if (store.endingsUnlocked.length >= 7) {
      store.setStage('MEMORIAL');
    } else {
      alert(`Bạn đã mở khóa ${store.endingsUnlocked.length}/7 kết cục. Hãy thu thập đủ 7 kết cục để mở khóa Ký ức cuối cùng của Ông Nội!`);
      store.setStage('TITLE');
    }
  };

  const disagree = () => {
    if (store.isSoundOn) audioManager.playBlipSFX();
    store.setStage('TITLE');
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
