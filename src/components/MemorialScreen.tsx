import { useGameStore } from '../store/useGameStore';

export function MemorialScreen() {
  return (
    <div className="absolute inset-0 bg-black text-parchment p-6 flex flex-col items-center justify-center font-pixel animate-fade-in-up">
      <div className="text-3xl text-gold-accent mb-8 drop-shadow-[2px_2px_0px_#000] text-center">
        HOÀN THÀNH TRÒ CHƠI
      </div>
      <div className="text-lg space-y-4 text-center">
        <p className="text-xl">Ghi Công:</p>
        <p>Kịch Bản & Lập Trình: Bạn</p>
        <p>Kiến Trúc Âm Thanh & Pixel Art: Thực hiện bằng trọn vẹn tâm huyết</p>
      </div>
      <div className="mt-12 text-center text-red-400 text-xl">
        Kính tặng và tưởng nhớ Ông nội yêu quý
      </div>
      <div className="mt-8 text-center text-sm text-gray-500">
        (Bấm tải lại trang để chơi lại)
      </div>
    </div>
  );
}
