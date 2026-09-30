
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function PhoneScamModal({ onClose }: { onClose: () => void }) {
  const store = useGameStore((s: any) => s);
  const [step, setStep] = useState(0);

  useEffect(() => {
    audioManager.playErrorSFX();
  }, []);

  const handlePay = () => {
    audioManager.playErrorSFX();
    store.removeCash(Math.min(5000000, store.cash));
    setStep(1);
  };

  const handleHangUp = () => {
    audioManager.playWinSFX();
    store.addCash(50000);
    setStep(2);
  };

  const handleJoke = () => {
    audioManager.playBlipSFX();
    setStep(3);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#fef3c7] border-4 border-[#78350f] p-4 w-full shadow-2xl relative">
        {step === 0 && (
          <>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-[64px] h-[64px] bg-[#1c1917] border-2 border-[#78350f] flex items-center justify-center text-red-500 font-bold text-3xl">?</div>
              <div>
                <h3 className="text-[#d97706] font-bold text-xl font-[VT323] uppercase">Số Lạ</h3>
                <p className="font-[Roboto_Mono] text-[15px] leading-tight text-[#1c1917]">
                  "Tôi là Đại úy Tuấn, thụ lý hồ sơ rửa tiền liên quan đến tài khoản của anh! Yêu cầu chuyển ngay 5.000.000đ để chứng minh trong sạch, nếu không sẽ niêm phong sạp hàng!"
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 font-[VT323] text-lg">
              <button onClick={handlePay} className="bg-[#991b1b] text-white px-3 py-1 border-2 border-[#450a0a] text-left">
                [CHUYỂN TIỀN NGAY VÌ SỢ]
              </button>
              <button onClick={handleHangUp} className="bg-[#15803d] text-white px-3 py-1 border-2 border-[#14532d] text-left">
                [CÚP MÁY CHỬI THẲNG]
              </button>
              <button onClick={handleJoke} className="bg-[#ca8a04] text-white px-3 py-1 border-2 border-[#713f12] text-left">
                [TRÊU ĐÙA CÂU GIỜ]
              </button>
            </div>
          </>
        )}
        
        {step === 1 && (
          <div className="text-center font-[Roboto_Mono]">
            <h2 className="text-[#991b1b] font-[VT323] text-3xl mb-2">BẠN ĐÃ BỊ LỪA!</h2>
            <p className="mb-4">Mất sạch tiền tích lũy vào tay kẻ gian.</p>
            <button onClick={onClose} className="bg-[#78350f] text-white px-4 py-2 font-[VT323] text-xl w-full border-2 border-[#3f2010]">ĐÓNG</button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center font-[Roboto_Mono]">
            <h2 className="text-[#15803d] font-[VT323] text-3xl mb-2">BẢN LĨNH!</h2>
            <p className="mb-4">"Lừa ai chứ đừng lừa thằng vừa phá sản này!"<br/>Khách xung quanh vỗ tay, thưởng bạn 50.000đ.</p>
            <button onClick={onClose} className="bg-[#78350f] text-white px-4 py-2 font-[VT323] text-xl w-full border-2 border-[#3f2010]">ĐÓNG</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center font-[Roboto_Mono]">
            <h2 className="text-[#d97706] font-[VT323] text-3xl mb-2">ĐẠI NHÂY!</h2>
            <p className="mb-4">Kẻ lừa đảo tức điên dập máy trước.<br/>(Đã ghi vào sổ tay số phận)</p>
            <button onClick={onClose} className="bg-[#78350f] text-white px-4 py-2 font-[VT323] text-xl w-full border-2 border-[#3f2010]">ĐÓNG</button>
          </div>
        )}
      </div>
    </div>
  );
}
