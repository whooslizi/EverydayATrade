import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { ENDINGS } from '../data/gameData';
import type { EndingId } from '../types';

export function DestinyJournalModal({ onClose }: { onClose: () => void }) {
  const store = useGameStore((s: any) => s);
  const endingsUnlocked = store.endingsUnlocked || [];

  const handleClose = () => {
    audioManager.playBlipSFX();
    onClose();
  };

  const handleReset = () => {
    if (confirm("Chắc chắn muốn xóa toàn bộ tiến trình và chơi lại?")) {
      audioManager.playBlipSFX();
      store.resetGame();
      onClose();
    }
  };

  const endingList = [
    { id: 'ENDING_1A_PRISON', label: '1A', hint: 'Chiếc còng số 8 lạnh buốt...' },
    { id: 'ENDING_1B_FUGITIVE', label: '1B', hint: 'Bóng tối sau lưng...' },
    { id: 'ENDING_2_ROMANCE', label: '2', hint: 'Tình yêu và tiền tài...' },
    { id: 'ENDING_3_UNDERCOVER', label: '3', hint: 'Phía sau lớp mặt nạ...' },
    { id: 'ENDING_4_HOSPITAL', label: '4', hint: 'Chiếc ghế nhựa oan nghiệt...' },
    { id: 'ENDING_5_DUNG_BETRAYAL', label: '5', hint: 'Tiếng sủa xé lòng...' },
    { id: 'ENDING_6_TRUE_MEMORIAL', label: '6', hint: 'Mùa hoa nở dưới gốc cây cũ...' },
    { id: 'ENDING_7_SOLD_DOG', label: '7', hint: 'Tiếng sủa xa xăm...' }
  ];

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-50 overflow-hidden font-sans">
      <div className="bg-[#23150d] border-4 border-[#854d0e] w-full max-w-[400px] h-[85%] flex flex-col relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Brass rivets */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-[#facc15] rounded-full border border-[#713f12]"></div>
        <div className="absolute top-1 right-1 w-2 h-2 bg-[#facc15] rounded-full border border-[#713f12]"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-[#facc15] rounded-full border border-[#713f12]"></div>
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-[#facc15] rounded-full border border-[#713f12]"></div>

        <h2 className="text-2xl font-[VT323] text-center text-[#facc15] mt-4 mb-2 uppercase tracking-wider drop-shadow-[2px_2px_0px_#000]">
          SỔ TAY SỐ PHẬN
        </h2>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 font-[Share_Tech_Mono] text-[#fef3c7] custom-scrollbar">
          {endingList.map(end => {
            const unlocked = endingsUnlocked.includes(end.id);
            const endingData = ENDINGS[end.id as EndingId];
            return (
              <div key={end.id} className={`p-3 border-2 ${unlocked ? 'border-[#facc15] bg-[#3f2010]' : 'border-[#451a03] bg-[#1a0e08] opacity-70'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold ${unlocked ? 'text-[#facc15]' : 'text-gray-500'}`}>Kết cục {end.label}</h3>
                  {unlocked && <span className="text-xs bg-[#991b1b] text-white px-1 border border-[#450a0a]">ĐÃ MỞ KHÓA</span>}
                </div>
                <p className="text-sm text-[#d4d4d8] italic">{unlocked ? endingData?.title : end.hint}</p>
                {unlocked && (
                  <button className="mt-2 text-xs bg-[#78350f] px-2 py-1 border border-[#451a03] hover:bg-[#854d0e]">
                    [XEM LẠI]
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#1a0e08] border-t-4 border-[#854d0e] flex gap-2 shrink-0">
          <button onClick={handleReset} className="flex-1 bg-[#991b1b] text-white py-2 border-2 border-[#450a0a] font-[VT323] text-lg hover:bg-[#b91c1c]">
            CHƠI LẠI
          </button>
          <button onClick={handleClose} className="flex-1 bg-[#facc15] text-[#1c1917] py-2 border-2 border-[#854d0e] font-[VT323] text-lg hover:bg-[#fde047]">
            ĐÓNG SỔ TAY
          </button>
        </div>
      </div>
    </div>
  );
}
