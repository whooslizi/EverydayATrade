import { useState } from 'react';
import { audioManager } from '../audio/AudioManager';

const REPO_URL = 'https://github.com/whooslizi/EverydayaTrade';

export function PreGameDisclaimerModal({ onAccept }: { onAccept: () => void }) {
  const [denied, setDenied] = useState(false);

  const accept = () => {
    audioManager.init();
    audioManager.playBlipSFX();
    localStorage.setItem('disclaimer_accepted', 'true');
    onAccept();
  };

  if (denied) {
    return (
      <div className="absolute inset-0 bg-[#0c0704] flex flex-col items-center justify-center p-4 z-50">
        <div className="bg-[#fef3c7] border-4 border-[#78350f] p-6 shadow-[0_10px_0_#451a03] font-['Share_Tech_Mono'] text-[#1c1917] max-w-[360px] text-center w-full">
          <h2 className="font-['VT323'] text-[26px] leading-tight text-[#991b1b] mb-4 drop-shadow-[1px_1px_0px_rgba(120,53,15,0.35)]">
            TRUY CẬP BỊ TỪ CHỐI
          </h2>
          <p className="mb-6 text-[16px] leading-relaxed">Bạn đã từ chối điều khoản miễn trừ trách nhiệm.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#15803d] hover:bg-[#166534] text-white py-2 px-4 border-2 border-[#14532d] shadow-[0_3px_0_#14532d] font-['VT323'] text-[22px] w-full drop-shadow-[2px_2px_0px_#000]"
          >
            TẢI LẠI TRANG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#fef3c7] border-4 border-[#78350f] p-5 shadow-[0_10px_0_#451a03] font-['Share_Tech_Mono'] text-[#1c1917] max-w-[400px] w-full max-h-[94%] overflow-y-auto">
        <h1 className="font-['VT323'] text-[26px] text-[#78350f] text-center mb-4 leading-tight uppercase drop-shadow-[1px_1px_0px_rgba(120,53,15,0.35)]">
          THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH
        </h1>

        <div className="text-[15px] space-y-3 mb-5 leading-relaxed">
          <p>
            Trò chơi 'Mỗi Ngày Một Nghề' là sản phẩm hư cấu hoàn toàn, phục vụ mục đích giải trí và trải nghiệm mô phỏng
            sinh tồn hè phố.
          </p>

          <div className="bg-[#1e3a8a] border-2 border-[#1e40af] border-l-8 border-l-[#60a5fa] p-3 shadow-[0_3px_0_#1e3a8a]">
            <div className="font-['VT323'] text-[20px] leading-none text-[#60a5fa] mb-2 drop-shadow-[2px_2px_0px_#000]">
              MỜI KHẢO SÁT NGHIÊN CỨU
            </div>
            <p className="text-[15px] leading-relaxed text-[#fef3c7] drop-shadow-[2px_2px_0px_#000]">
              Chào bạn! Trò chơi bạn đang trải nghiệm là một phần trong dự án nghiên cứu của nhóm chúng mình. Bức ảnh banner ngoài màn hình chính là một tác phẩm được tạo ra bởi AI, và trong quá trình chơi, bạn sẽ bắt gặp các bức tranh pixel do nhóm tự code bằng Python Art.
              <br/><br/>
              Sau khi chơi xong, mong bạn dành chút thời gian giúp nhóm điền bảng "Khảo sát cảm nhận người chơi giữa tranh AI và nghệ thuật lập trình" <a href="https://forms.gle/5yWWoib1NpDqdP6fA" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] underline decoration-2 underline-offset-2 hover:text-white">tại đây</a> nhé. Nhóm xin chân thành cảm ơn!
            </p>
          </div>

          <p>
            Mọi danh xưng, bối cảnh, nghề nghiệp và tuyến nhân vật (như chú chó Dũng, anh Tôm buôn thực phẩm giả, bạn Hà,
            Hoàng IT, sinh viên Bách khoa, phong trào xóa game PUBG,...) hoàn toàn mang tính chất xây dựng kịch bản trào
            phúng.
          </p>
          <p>
            Tác phẩm tuyệt đối KHÔNG có ý định ám chỉ, bôi nhọ, xúc phạm, đánh đồng hay đại diện cho bất kỳ cá nhân, tổ
            chức hay nguyên mẫu ngoài đời thực nào. Mọi sự trùng hợp về danh xưng hay tình huống đều là ngẫu nhiên.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={accept}
            className="bg-[#15803d] hover:bg-[#166534] text-white py-2 px-4 border-2 border-[#14532d] shadow-[0_3px_0_#14532d] font-['VT323'] text-[22px] w-full text-center drop-shadow-[2px_2px_0px_#000]"
          >
            TÔI ĐỒNG TÌNH
          </button>
          <button
            onClick={() => setDenied(true)}
            className="bg-[#991b1b] hover:bg-[#b91c1c] text-white py-2 px-4 border-2 border-[#450a0a] shadow-[0_3px_0_#450a0a] font-['VT323'] text-[22px] w-full text-center drop-shadow-[2px_2px_0px_#000]"
          >
            TÔI KHÔNG ĐỒNG TÌNH
          </button>
        </div>
      </div>
    </div>
  );
}
