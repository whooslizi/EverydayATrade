
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { ENDINGS } from '../data/gameData';

export function WastedModal() {
  const store = useGameStore((s: any) => s);
  const [phase, setPhase] = useState<'beating' | 'news' | 'shake' | 'unlocked' | 'options'>(store.endingId === 'ENDING_7_SOLD_DOG' ? 'beating' : 'shake');

  useEffect(() => {
    if (store.endingId === 'ENDING_7_SOLD_DOG') {
      let beats = 0;
      const beatInt = setInterval(() => {
        audioManager.playWastedHit();
        beats++;
        if (beats > 3) clearInterval(beatInt);
      }, 400);
      
      const tNews = setTimeout(() => setPhase('news'), 2000);
      const tShake = setTimeout(() => {
        setPhase('shake');
        audioManager.playWastedHit();
      }, 6000);
      const tUnlock = setTimeout(() => setPhase('unlocked'), 7500);
      const tOptions = setTimeout(() => setPhase('options'), 9500);
      
      return () => { clearInterval(beatInt); clearTimeout(tNews); clearTimeout(tShake); clearTimeout(tUnlock); clearTimeout(tOptions); };
    } else {
      audioManager.playWastedHit();
      const t1 = setTimeout(() => setPhase('unlocked'), 1500);
      const t2 = setTimeout(() => setPhase('options'), 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [store.endingId]);

  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-4 transition-all duration-1000 ${phase === 'shake' ? 'bg-black/40 backdrop-grayscale' : 'bg-black/90'}`}>
      
      {phase === 'beating' && (
        <div className="absolute inset-0 bg-red-900 animate-pulse flex items-center justify-center">
          <div className="text-white font-[VT323] text-6xl rotate-12 drop-shadow-lg">BỐP!!</div>
          <div className="text-white font-[VT323] text-5xl -rotate-12 absolute bottom-20 left-10 drop-shadow-lg">CHÁT!!</div>
        </div>
      )}

      {phase === 'news' && (
        <div className="bg-white p-4 max-w-[340px] shadow-2xl rotate-2 grayscale sepia flex flex-col items-center animate-slide-up border border-gray-400">
          <h1 className="font-[VT323] text-4xl text-black border-b-4 border-black w-full text-center mb-2 font-bold tracking-tighter">BÁO AN NINH</h1>
          <h2 className="font-[Roboto_Mono] text-xl font-bold text-black text-center uppercase leading-tight mb-3">Thanh niên bán hàng rong phố Thanh Xuân bị hội đồng dã man!</h2>
          <div className="w-full h-32 bg-gray-300 mb-3 flex items-center justify-center border border-gray-500">
             <span className="text-gray-500 font-['VT323']">[Ảnh hiện trường]</span>
          </div>
          <p className="font-[Roboto_Mono] text-[13px] text-justify text-black">
            Vào trưa nay, một nam thanh niên bán hàng trên vỉa hè phố Thanh Xuân đã bị một nhóm người tự xưng là "Hội bảo vệ động vật" lao vào hành hung túi bụi bằng ghế nhựa và điếu cày. Theo người dân, nạn nhân vừa thực hiện giao dịch bán đi chú chó cỏ trung thành của mình với giá 363.636đ. Hiện nạn nhân đang cấp cứu trong tình trạng đa chấn thương.
          </p>
        </div>
      )}

      {phase === 'shake' && (
        <div className="animate-shake w-full bg-[#991b1b] border-y-4 border-[#450a0a] py-6 text-center shadow-[0_0_30px_rgba(153,27,27,0.8)]">
          <h1 className="font-[VT323] text-5xl text-white tracking-widest drop-shadow-[3px_3px_0_#000]">
            {store.endingId === 'ENDING_7_SOLD_DOG' ? 'THẤT BẠI THẢM HẠI: BÁN BẠN CẦU VINH' : 'THẤT BẠI THẢM HẠI'}
          </h1>
        </div>
      )}

      {phase === 'unlocked' && (
        <div className="animate-pulse w-full bg-[#facc15] border-y-4 border-[#ca8a04] py-4 text-center">
          <h2 className="font-[VT323] text-3xl text-[#78350f] drop-shadow-[2px_2px_0_#fff]">
            MỞ KHÓA MẢNH KÝ ỨC
          </h2>
          <p className="font-[Roboto_Mono] text-[#78350f] font-bold mt-1 text-[15px]">(PROLOGUE UNLOCKED)</p>
        </div>
      )}

      {phase === 'options' && (
        <div className="bg-[#fef3c7] border-4 border-[#78350f] p-5 w-full max-w-[320px] shadow-2xl animate-slide-up flex flex-col gap-3">
          {store.endingId && ENDINGS[store.endingId as keyof typeof ENDINGS]?.story.map((s, i) => (
            <p key={i} className="font-[Roboto_Mono] text-[15px] text-[#1c1917] italic text-center mb-2">
              {s}
            </p>
          ))}
          <h2 className="font-[VT323] text-3xl text-center text-[#991b1b] mb-2 border-b-2 border-[#78350f] pb-2">KẾT CỤC</h2>
          
          <button 
            onClick={() => store.resetGame()} 
            className="bg-[#991b1b] hover:bg-[#b91c1c] text-white py-2 px-4 border-2 border-[#450a0a] font-[VT323] text-xl w-full"
          >
            VỀ MÀN HÌNH CHÍNH
          </button>
        </div>
      )}
    </div>
  );
}
