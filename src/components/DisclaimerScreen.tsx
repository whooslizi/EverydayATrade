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
      <div className="bg-[#2d2222] text-[#fdf6e2] max-w-[420px] w-full rounded-[24px] p-8 shadow-2xl border-4 border-[#3e3030] flex flex-col items-center animate-slide-up">
        
        <h1 className="text-[20px] font-black mb-4 text-center text-[#ff6b6b] uppercase tracking-wide">
          THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH
        </h1>
        <p className="text-center font-medium mb-6 text-[14px] leading-relaxed text-[#e8dcdc] text-justify">
          Trò chơi 'Mỗi Ngày Một Nghề' là sản phẩm hư cấu phục vụ mục đích giải trí và trải nghiệm sinh tồn vỉa hè. Mọi danh xưng nhân vật xuất hiện trong game hoàn toàn chỉ mang tính chất định vị bối cảnh để người chơi dễ theo dõi. Trò chơi tuyệt đối KHÔNG có ý định ám chỉ, bôi nhọ, đánh đồng hay đại diện cho bất kỳ cá nhân, tổ chức hay nguyên mẫu ngoài đời thực nào. Mọi sự trùng hợp về tên gọi hoàn toàn là ngẫu nhiên.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={agree}
            className="flex-1 bg-[#ff6b6b] text-white font-bold text-sm py-4 rounded-[16px] hover:bg-[#fa5252] transition-colors shadow-[0_4px_0_#c92a2a] active:translate-y-1 active:shadow-none"
          >
            Tôi đồng tình
          </button>
          
          <button
            onClick={disagree}
            className="flex-1 bg-[#4a3939] text-[#e8dcdc] font-bold text-sm py-4 rounded-[16px] border-2 border-[#3e3030] hover:bg-[#5a4646] transition-colors active:translate-y-1"
          >
            Tôi không đồng tình
          </button>
        </div>
      </div>
    </div>
  );
}
