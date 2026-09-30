
import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function PreGameDisclaimerModal() {
  const store = useGameStore((s: any) => s);
  const [denied, setDenied] = useState(false);

  const accept = () => {
    audioManager.init();
    audioManager.playBlipSFX();
    store.acceptDisclaimer();
  };

  const decline = () => {
    setDenied(true);
  };

  if (denied) {
    return (
      <div className="absolute inset-0 bg-[#1a0e08] flex flex-col items-center justify-center p-4 z-50">
        <div className="bg-[#fef3c7] border-4 border-[#78350f] p-5 shadow-2xl font-[Share_Tech_Mono] text-[#1c1917] max-w-[360px] text-center w-full">
          <h2 className="font-[VT323] text-2xl text-[#991b1b] mb-4">TRUY CẬP BỊ TỪ CHỐI</h2>
          <p className="mb-6 text-[15px]">Bạn đã từ chối điều khoản miễn trừ trách nhiệm. Không thể truy cập trò chơi.</p>
          <button onClick={() => window.location.reload()} className="bg-[#15803d] hover:bg-[#166534] text-white py-2 px-4 border-2 border-[#14532d] font-[VT323] text-xl w-full">
            TẢI LẠI TRANG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#fef3c7] border-4 border-[#78350f] p-5 shadow-2xl font-[Share_Tech_Mono] text-[#1c1917] max-w-[380px] w-full">
        <h1 className="font-[VT323] text-2xl text-[#78350f] text-center mb-4 leading-tight">
          THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH
        </h1>
        <div className="text-[15px] space-y-3 mb-6 text-justify leading-relaxed">
          <p>Trò chơi "Mỗi Ngày Một Nghề" là sản phẩm hư cấu hoàn toàn, phục vụ mục đích giải trí và trải nghiệm mô phỏng sinh tồn hè phố.</p>
          <p>Mọi danh xưng, bối cảnh, nghề nghiệp và tuyến nhân vật (như chú chó Dũng, anh Tôm bán thực phẩm giả, bạn Hà, Hoàng IT, sinh viên Bách khoa,...) hoàn toàn mang tính chất xây dựng kịch bản trào phúng.</p>
          <p>Tác phẩm tuyệt đối KHÔNG có ý định ám chỉ, bôi nhọ, xúc phạm, đánh đồng hay đại diện cho bất kỳ cá nhân, tổ chức hay nguyên mẫu ngoài đời thực nào.</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={accept} className="bg-[#15803d] hover:bg-[#166534] text-white py-2 px-4 border-2 border-[#14532d] font-[VT323] text-xl w-full text-center shadow-sm">
            TÔI ĐỒNG TÌNH
          </button>
          <button onClick={decline} className="bg-[#991b1b] hover:bg-[#b91c1c] text-white py-2 px-4 border-2 border-[#450a0a] font-[VT323] text-xl w-full text-center shadow-sm">
            TÔI KHÔNG ĐỒNG TÌNH
          </button>
        </div>
      </div>
    </div>
  );
}
