
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function RoadmapModal({ onClose }: { onClose: () => void }) {
  const endingsUnlocked = useGameStore(s => s.endingsUnlocked) || [];
  
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 z-50 overflow-hidden font-sans">
      <div className="pixel-panel w-full max-w-[380px] h-[80%] flex flex-col animate-slide-up relative flex flex-col animate-slide-up relative">
        <h2 className="text-2xl font-black text-center text-[#fcc419] mb-4 uppercase tracking-wider">Nhật Ký Số Phận</h2>
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          <ul className="text-sm space-y-2 text-gray-400">
            <li className={endingsUnlocked.includes('ENDING_1A_PRISON') ? 'text-white' : ''}>1A: {endingsUnlocked.includes('ENDING_1A_PRISON') ? 'Tù Tội Dài Hạn' : '???'}</li>
            <li className={endingsUnlocked.includes('ENDING_1B_FUGITIVE') ? 'text-white' : ''}>1B: {endingsUnlocked.includes('ENDING_1B_FUGITIVE') ? 'Bị Tôm Lừa Gạt' : '???'}</li>
            <li className={endingsUnlocked.includes('ENDING_2_ROMANCE') ? 'text-white' : ''}>2: {endingsUnlocked.includes('ENDING_2_ROMANCE') ? 'Chân Thành Cưới Phú Bà' : '???'}</li>
            <li className={endingsUnlocked.includes('ENDING_3_UNDERCOVER') ? 'text-white' : ''}>3: {endingsUnlocked.includes('ENDING_3_UNDERCOVER') ? 'Cảnh Sát Chìm Sờ Gáy' : '???'}</li>
            <li className={endingsUnlocked.includes('ENDING_4_HOSPITAL') ? 'text-white' : ''}>4: {endingsUnlocked.includes('ENDING_4_HOSPITAL') ? 'Cơn Thịnh Nộ Ghế Nhựa' : '???'}</li>
            <li className={endingsUnlocked.includes('ENDING_5_DUNG_BETRAYAL') ? 'text-white' : ''}>5: {endingsUnlocked.includes('ENDING_5_DUNG_BETRAYAL') ? 'Dũng Bán Đứng Chủ' : '???'}</li>
            <li className={endingsUnlocked.includes('ENDING_6_TRUE_MEMORIAL') ? 'text-green-300 font-bold' : ''}>6: {endingsUnlocked.includes('ENDING_6_TRUE_MEMORIAL') ? 'Lời Hẹn Dưới Gốc Đào (True Ending)' : '???'}</li>
          </ul>
        </div>
        <button onClick={onClose} className="w-full mt-4 pixel-btn-gray text-lg">ĐÓNG</button>
      </div>
    </div>
  );
}
