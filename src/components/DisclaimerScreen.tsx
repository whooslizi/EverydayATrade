import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function DisclaimerScreen() {
  const acceptDisclaimer = useGameStore((s) => s.acceptDisclaimer);
  const isSoundOn = useGameStore((s) => s.isSoundOn);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#1a1414]/90 z-50 p-4 font-sans select-none">
      <div className="bg-[#2d2222] text-[#fdf6e2] max-w-[420px] w-full rounded-[24px] p-8 shadow-2xl border-4 border-[#3e3030] flex flex-col items-center animate-slide-up">
        
        {/* Miễn trừ trách nhiệm */}
        <h1 className="text-[26px] font-black mb-4 text-center text-[#ff6b6b] uppercase tracking-wide">
          Miễn Trừ Trách Nhiệm
        </h1>
        <p className="text-center font-medium mb-6 text-[15px] leading-relaxed text-[#e8dcdc]">
          Tất cả các nhân vật và tình huống trong game hoàn toàn là hư cấu. Bất kỳ sự trùng hợp nào với người thật hay sự việc ngoài đời đều chỉ là... sự cố ngẫu nhiên của vũ trụ. Chúng tôi không cố ý đánh đồng hay "đá xéo" ai đâu nhé!
        </p>
        
        {/* Cảnh báo AI */}
        <div className="bg-[#221919] rounded-[16px] p-5 w-full mb-8 border-2 border-[#ff6b6b]/30">
          <h2 className="text-xl font-bold text-[#ff6b6b] mb-2 flex items-center gap-2">
            <span>🤖</span> Thú tội mỏng:
          </h2>
          <p className="text-[14px] text-[#c7baba] leading-relaxed">
            Để tiết kiệm chi phí (vì quỹ thuê hoạ sĩ đang âm vô cực), game buộc phải sử dụng một số hình ảnh được generate từ AI. Biết là hơi "cringe" một chút, nhưng mong các đồng âm giơ cao đánh khẽ và tập trung vào gameplay nhé! 🥲
          </p>
        </div>

        <button
          onClick={() => {
            if (isSoundOn) audioManager.playBlipSFX();
            acceptDisclaimer();
          }}
          className="w-full bg-[#ff6b6b] text-white font-bold text-xl py-4 rounded-[16px] hover:bg-[#fa5252] transition-colors shadow-[0_4px_0_#c92a2a] active:translate-y-1 active:shadow-none"
        >
          Đã hiểu & Bắt đầu
        </button>
      </div>
    </div>
  );
}
