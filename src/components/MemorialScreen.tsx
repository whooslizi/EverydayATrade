
import { useGameStore } from '../store/useGameStore';

export function MemorialScreen() {
  const setStage = useGameStore((s) => s.setStage);
  return (
    <div className="absolute inset-0 bg-[#120e0e] text-[#fdf6e2] p-6 flex flex-col items-center justify-center font-sans animate-fade-in-up select-none">
      <div className="max-w-[400px] w-full border-4 border-[#3e3030] bg-[#1a1414] rounded-2xl p-6 shadow-2xl relative">
        <pre className="text-[12px] md:text-sm font-mono text-center text-[#ff6b6b] mb-6 leading-relaxed whitespace-pre-wrap">
========== HOÀN THÀNH TRÒ CHƠI ==========
        </pre>
        <div className="text-center space-y-3 font-medium text-[#e8dcdc] mb-8">
          <p>Kịch Bản & Lập Trình: Bạn</p>
          <p>Kiến Trúc Âm Thanh & Pixel Art: Thực hiện bằng trọn vẹn tâm huyết</p>
        </div>
        <div className="text-center text-[#ff6b6b] font-bold text-lg italic mt-8 mb-6">
          Kính tặng và tưởng nhớ Ông nội yêu quý
        </div>
        <button onClick={() => setStage('TITLE')} className="w-full bg-[#4a3939] text-[#fdf6e2] py-3 rounded-xl font-bold border-2 border-[#3e3030] hover:bg-[#5a4646]">
          TRỞ VỀ MÀN HÌNH CHÍNH
        </button>
      </div>
    </div>
  );
}
