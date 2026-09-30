import { useState } from 'react';
import { audioManager } from '../audio/AudioManager';

export function PreGameDisclaimerModal({ onAccept }: { onAccept: () => void }) {
  const [rejected, setRejected] = useState(false);

  const handleAccept = () => {
    audioManager.init();
    audioManager.playBlipSFX();
    localStorage.setItem('disclaimer_accepted', 'true');
    onAccept();
  };

  const handleReject = () => {
    audioManager.init();
    audioManager.playErrorSFX();
    setRejected(true);
  };

  if (rejected) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-[9999]">
        <div className="bg-[#fef3c7] border-4 border-[#78350f] p-6 shadow-[0_10px_0_#451a03] max-w-md w-full text-center">
          <h2 className="font-[VT323] text-2xl text-[#991b1b] uppercase mb-4">
            TRUY CẬP BỊ TỪ CHỐI
          </h2>
          <p className="font-[Share_Tech_Mono] text-[#3e2723] text-base mb-6 leading-relaxed">
            Bạn đã từ chối điều khoản miễn trừ trách nhiệm. Không thể truy cập trò chơi.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="pixel-btn pixel-btn-gray w-full font-[VT323] text-xl"
          >
            TẢI LẠI TRANG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div className="bg-[#fef3c7] border-4 border-[#78350f] p-6 shadow-[0_10px_0_#451a03] max-w-lg w-full animate-slide-up">
        <h2 className="font-[VT323] text-2xl text-[#78350f] uppercase mb-4 text-center tracking-wide">
          THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH
        </h2>

        <div className="font-[Share_Tech_Mono] text-[#3e2723] text-sm leading-relaxed mb-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <p className="mb-3">
            Trò chơi 'Mỗi Ngày Một Nghề' là sản phẩm hư cấu hoàn toàn, phục vụ mục đích giải trí và trải nghiệm mô phỏng sinh tồn hè phố. Mọi danh xưng, bối cảnh, nghề nghiệp và tuyến nhân vật (như chú chó Dũng, anh Tôm buôn thực phẩm giả, bạn Hà, Hoàng IT, sinh viên Bách khoa,...) hoàn toàn mang tính chất xây dựng kịch bản trào phúng.
          </p>
          <p className="mb-3">
            Tác phẩm tuyệt đối KHÔNG có ý định ám chỉ, bôi nhọ, xúc phạm, đánh đồng hay đại diện cho bất kỳ cá nhân, tổ chức hay nguyên mẫu ngoài đời thực nào. Mọi sự trùng hợp về danh xưng hay tình huống đều là ngẫu nhiên.
          </p>
          <p className="text-xs text-[#78350f] italic">
            Game có sử dụng hình ảnh được tạo bằng code (ngân sách họa sĩ = âm vô cực).
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="pixel-btn pixel-btn-green flex-1 font-[VT323] text-xl border-2 border-[#14532d]"
          >
            TÔI ĐỒNG TÌNH
          </button>
          <button
            onClick={handleReject}
            className="pixel-btn pixel-btn-red flex-1 font-[VT323] text-xl border-2 border-[#450a0a]"
          >
            TÔI KHÔNG ĐỒNG TÌNH
          </button>
        </div>
      </div>
    </div>
  );
}
