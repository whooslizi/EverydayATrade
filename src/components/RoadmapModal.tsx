import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function RoadmapModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/80 z-50 p-4 flex items-center justify-center font-game">
      <div className="bg-parchment text-dark-brown p-6 border-4 border-dark-brown shadow-2xl w-full max-h-full overflow-y-auto">
        <h2 className="text-3xl text-center font-pixel mb-4 drop-shadow-[2px_2px_0px_#000] text-red-accent">NHẬT KÝ SỐ PHẬN</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold font-pixel mb-2 text-gold-accent bg-dark-brown p-2 inline-block">Tiền Truyện (Prologue)</h3>
          <p className="text-base leading-relaxed">
            48 giờ trước: Tỷ phú công nghệ phá sản, người yêu cũ dứt áo ra đi, tài khoản về 0.<br/>
            Hiện tại: Nợ Cụ Bá 20.000.000đ, hạn chót 14 ngày, lãi đêm 50.000đ.<br/>
            Hành trang: 100.000đ tiền vốn, 1 chú chó cỏ tên Dũng, và tấm vé nhật ký bốc thăm nghề vỉa hè.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold font-pixel mb-3 text-gold-accent bg-dark-brown p-2 inline-block">Bản Đồ 7 Kết Cục</h3>
          <ul className="text-base space-y-3">
            <li><span className="font-bold">Kết 1A: Tù Tội Dài Hạn</span> - Kẹt trong lao lý vì không có tiền bảo lãnh</li>
            <li><span className="font-bold">Kết 1B: Bị Tôm Lừa Gạt</span> - Bị tay buôn thực phẩm giả bỏ rơi khi vượt ngục</li>
            <li><span className="font-bold">Kết 2: Chân Thành Cưới Phú Bà</span> - Được quý cô sang trọng nâng đỡ nhờ giữ trọn nhân cách</li>
            <li><span className="font-bold">Kết 3: Cảnh Sát Chìm Sờ Gáy</span> - Bán phá giá đáng ngờ suốt 14 ngày</li>
            <li><span className="font-bold">Kết 4: Cơn Thịnh Nộ Ghế Nhựa</span> - Chặt chém quá đà bị tổ dân phố đập nhập viện</li>
            <li><span className="font-bold">Kết 5: Dũng Bán Đứng Chủ</span> - Bỏ đói chó Dũng khiến nó chạy về dẫn Cụ Bá tới siết nợ</li>
            <li><span className="font-bold text-red-accent">Kết 6: Lời Hẹn Dưới Gốc Đào</span> - True Ending: Trả hết nợ, về quê viếng mộ Ông Đào</li>
          </ul>
        </div>
        
        <button onClick={() => { audioManager.audioManager.playBlipSFX(); onClose(); }} className="mt-6 w-full text-xl font-pixel bg-dark-brown text-parchment py-3 border-2 border-black hover:bg-black transition-colors">
          ĐÓNG NHẬT KÝ
        </button>
      </div>
    </div>
  );
}
