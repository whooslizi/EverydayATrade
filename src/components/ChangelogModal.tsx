import { useState } from 'react';

export function ChangelogModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#fef3c7] border-4 border-[#78350f] p-4 w-full max-w-[340px] shadow-2xl animate-slide-up flex flex-col gap-3">
        <h2 className="font-['VT323'] text-3xl text-[#991b1b] text-center border-b-2 border-[#78350f] pb-2">NHẬT KÝ CẬP NHẬT</h2>
        
        <div className="font-['Share_Tech_Mono'] text-sm text-[#1c1917] flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
          <div>
            <span className="font-bold text-[#15803d]">[v1.1] Tính Năng Mới</span>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Chế độ Continuous Shift: Khách xếp hàng liên tục trong 60s.</li>
              <li>Chửi Khách Động: Câu thoại chủ quán bám sát hoàn cảnh thực tế.</li>
              <li>Nghiệp Bán Chó: Bị "Hội bảo vệ động vật" đánh Wasted ngay ban ngày.</li>
              <li>Chuộc Lại Chó: Mua lại chó Dũng với giá đắt gấp 3 lần (1.000.000đ).</li>
              <li>New Game+: Bỏ qua giới thiệu khi đã chơi nhiều lần.</li>
            </ul>
          </div>
        </div>

        <p className="font-['Share_Tech_Mono'] text-xs text-[#991b1b] italic text-center">
          Nếu chưa thấy tính năng mới, hãy tải lại trang!
        </p>

        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => window.location.reload()} 
            className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white py-2 border-2 border-[#14532d] font-['VT323'] text-xl"
          >
            TẢI LẠI TRANG
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 bg-[#991b1b] hover:bg-[#b91c1c] text-white py-2 border-2 border-[#450a0a] font-['VT323'] text-xl"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
}
