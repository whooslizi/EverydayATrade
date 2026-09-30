import useGameStore from '../store/useGameStore';

export default function MemorialScreen() {
  const setStage = useGameStore((s) => s.setStage);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0c0a09] p-4">
      <div className="pixel-panel border-4 border-[#78471c] max-w-lg w-full text-center">
        <pre className="font-[VT323] text-[#fbc02d] text-sm leading-tight mb-6 overflow-x-auto">
{`========== HOÀN THÀNH TRÒ CHƠI ==========`}
        </pre>

        <div className="space-y-2 mb-6">
          <p className="font-[Share_Tech_Mono] text-sm text-[#e0d6c2]">
            Kich Ban &amp; Lap Trinh: Ban
          </p>
          <p className="font-[Share_Tech_Mono] text-sm text-[#e0d6c2]">
            Kien Truc Am Thanh &amp; Pixel Art: Thuc hien bang tron ven tam huyet
          </p>
        </div>

        <p className="font-[Share_Tech_Mono] text-sm text-[#d32f2f] italic mb-8">
          Kính tặng và tưởng nhớ Ông nội yêu quý
        </p>

        <button
          className="pixel-btn-gray"
          onClick={() => setStage('TITLE')}
        >
          TRO VỀ MÀN HÌNH CHÍNH
        </button>
      </div>
    </div>
  );
}
