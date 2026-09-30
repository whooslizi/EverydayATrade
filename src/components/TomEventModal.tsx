import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function TomEventModal({ onClose }: { onClose: () => void }) {
  const store = useGameStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    audioManager.playBlipSFX();
  }, []);

  const handleBite = () => {
    audioManager.playErrorSFX();
    store.addLog('Dũng cắn Anh Tôm! Trung thành +10.');
    useGameStore.setState(s => ({ dog: { ...s.dog, loyalty: Math.min(100, s.dog.loyalty + 10) } }));
    setStep(1);
  };

  const handleIgnore = () => {
    audioManager.playBlipSFX();
    store.addLog('Bị Anh Tôm chế giễu...');
    setStep(2);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-game">
      <div className="bg-[#fef3c7] border-4 border-[#78350f] p-4 w-full shadow-2xl relative animate-slide-up">
        {step === 0 && (
          <>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-[64px] h-[64px] bg-[#d97706] border-2 border-[#78350f] flex items-center justify-center overflow-hidden shrink-0">
                <img src="/sprites/portraits/tom.png" alt="Anh Tôm" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
              </div>
              <div>
                <h3 className="text-[#d97706] font-bold text-xl font-[VT323] uppercase">Anh Tôm (Chủ tịch rởm)</h3>
                <p className="font-[Share_Tech_Mono] text-[15px] leading-tight text-[#1c1917]">
                  "Đấy, trước tao nói có sai đâu, học cái trường này cho lắm rồi rốt cuộc ra vỉa hè bán đệm cho mẹ à? Nhìn tao làm Chủ tịch tập đoàn đi Roll Royce sướng không?!"
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 font-[VT323] text-lg">
              <button onClick={handleBite} className="bg-[#991b1b] text-white px-3 py-2 border-2 border-[#450a0a] text-left hover:bg-[#b91c1c]">
                [ THẢ CHÓ DŨNG RA CẮN ]
              </button>
              <button onClick={handleIgnore} className="bg-[#15803d] text-white px-3 py-2 border-2 border-[#14532d] text-left hover:bg-[#166534]">
                [ NGẬM NGÙI BỎ QUA ]
              </button>
            </div>
          </>
        )}
        
        {step === 1 && (
          <div className="text-center font-[Share_Tech_Mono]">
            <h2 className="text-[#991b1b] font-[VT323] text-3xl mb-2">CHÓ NGOAN!</h2>
            <p className="mb-4">Dũng phi ra gầm gừ, đớp thẳng vào ống quần hàng hiệu của Tôm. Hắn hoảng hốt bỏ chạy té khói để lại tiếng chửi rủa!<br/>(Độ trung thành của Dũng tăng lên!)</p>
            <button onClick={onClose} className="bg-[#78350f] text-white px-4 py-2 font-[VT323] text-xl w-full border-2 border-[#3f2010] hover:bg-[#92400e]">ĐÓNG</button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center font-[Share_Tech_Mono]">
            <h2 className="text-[#ca8a04] font-[VT323] text-3xl mb-2">KỆ KẺ TIỂU NHÂN</h2>
            <p className="mb-4">Bạn im lặng dọn hàng. Dũng nằm vẫy đuôi nhìn bạn. Dù sao thì, lao động chân chính không bao giờ phải cúi đầu trước những kẻ lừa đảo.</p>
            <button onClick={onClose} className="bg-[#78350f] text-white px-4 py-2 font-[VT323] text-xl w-full border-2 border-[#3f2010] hover:bg-[#92400e]">ĐÓNG</button>
          </div>
        )}
      </div>
    </div>
  );
}
