
import { useGameStore } from '../store/useGameStore';

export function MemorialScreen() {
  const setStage = useGameStore((s) => s.setStage);
  return (
    <div className="absolute inset-0 bg-[#120e0e] text-[#fdf6e2] p-6 flex flex-col items-center justify-center font-sans animate-fade-in-up select-none">
      <div className="max-w-[400px] w-full border-4 border-[#3e3030] bg-[#1a1414] rounded-2xl p-6 shadow-2xl relative">
        <pre className="text-[12px] md:text-sm font-[Roboto_Mono] text-center text-[#ff6b6b] mb-6 leading-relaxed whitespace-pre-wrap">
========== HOÀN THÀNH TRÒ CHƠI ==========
        </pre>
        <div className="text-center space-y-3 font-[Roboto_Mono] text-[#e8dcdc] mb-8">
          <p>Kịch Bản & Lập Trình: Bạn</p>
          <p>Kiến Trúc Âm Thanh & Pixel Art: Thực hiện bằng trọn vẹn tâm huyết</p>
        </div>
        <div className="text-center font-[Roboto_Mono] text-[#ff6b6b] font-bold text-lg italic mt-8 mb-4">
          Kính tặng và tưởng nhớ Ông nội yêu quý
        </div>
        <div className="text-center font-[Roboto_Mono] text-sm text-[#78716c] mb-6">
          Credits: @whooslizi
        </div>
        <button onClick={() => setStage('TITLE')} className="w-full bg-[#4a3939] text-[#fdf6e2] py-3 rounded-xl font-bold border-2 border-[#3e3030] hover:bg-[#5a4646]">
          TRỞ VỀ MÀN HÌNH CHÍNH
        </button>
      </div>
    </div>
  );
}
