import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

export function RoadmapModal({ onClose }: { onClose: () => void }) {
  const endingsUnlocked = useGameStore(s => (s as any).endingsUnlocked) || [];
  const hasFinished = endingsUnlocked.length > 0;

  const handleClose = () => {
    audioManager.playBlipSFX();
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 z-50 overflow-hidden font-sans">
      <div className="bg-[#2d2222] text-[#fdf6e2] w-full max-w-[380px] h-[80%] rounded-[24px] p-6 shadow-2xl border-4 border-[#3e3030] flex flex-col animate-slide-up relative">
        <h2 className="text-2xl font-black text-center text-[#fcc419] mb-4 uppercase tracking-wider">
          Nhật Ký Số Phận
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {hasFinished ? (
            <>
              <div className="bg-[#1a1414] p-4 rounded-xl border-2 border-[#3e3030]">
                <h3 className="text-[#ff6b6b] font-bold mb-2">Prologue (Khởi Nguồn)</h3>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  Từ đỉnh cao của một tỷ phú công nghệ, bạn mất tất cả sau một đêm. Cổ phiếu bốc hơi, đối tác quay lưng, tài khoản bị đóng băng. 
                  Giờ đây, bạn chỉ còn đúng 100.000đ, một con chó hoang tên Dũng, và tấm vé "Mỗi Ngày Một Nghề" bí ẩn...
                </p>
              </div>
              
              <div className="bg-[#1a1414] p-4 rounded-xl border-2 border-[#3e3030]">
                <h3 className="text-green-400 font-bold mb-2">Tiến Độ Ending</h3>
                <ul className="text-sm space-y-2 text-gray-400">
                  <li className={endingsUnlocked.includes('1A') ? 'text-white' : ''}>1A: {endingsUnlocked.includes('1A') ? 'Tù Tội Dài Hạn' : '???'}</li>
                  <li className={endingsUnlocked.includes('1B') ? 'text-white' : ''}>1B: {endingsUnlocked.includes('1B') ? 'Bị Tôm Lừa Gạt' : '???'}</li>
                  <li className={endingsUnlocked.includes('2') ? 'text-white' : ''}>2: {endingsUnlocked.includes('2') ? 'Chân Thành Cưới Phú Bà' : '???'}</li>
                  <li className={endingsUnlocked.includes('3') ? 'text-white' : ''}>3: {endingsUnlocked.includes('3') ? 'Cảnh Sát Chìm Sờ Gáy' : '???'}</li>
                  <li className={endingsUnlocked.includes('4') ? 'text-white' : ''}>4: {endingsUnlocked.includes('4') ? 'Cơn Thịnh Nộ Ghế Nhựa' : '???'}</li>
                  <li className={endingsUnlocked.includes('5') ? 'text-white' : ''}>5: {endingsUnlocked.includes('5') ? 'Dũng Bán Đứng Chủ' : '???'}</li>
                  <li className={endingsUnlocked.includes('6') ? 'text-green-300 font-bold' : ''}>6: {endingsUnlocked.includes('6') ? 'Lời Hẹn Dưới Gốc Đào (True Ending)' : '???'}</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="text-[64px] opacity-20">🔒</div>
              <div>
                <h3 className="text-xl text-gray-500 font-bold mb-2">Prologue (Bị Khoá)</h3>
                <p className="text-lg text-[#ff6b6b] font-black">Ending 1: &lt;unknown&gt;</p>
              </div>
              <p className="text-sm text-gray-400 px-4">
                Hãy hoàn thành trò chơi ít nhất 1 lần để mở khoá nhật ký và xem lại hành trình của bạn.
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={handleClose}
          className="w-full mt-4 bg-[#4a3939] text-[#fdf6e2] font-bold text-lg py-3 rounded-xl border-2 border-[#3e3030] hover:bg-[#5a4646] transition-colors active:translate-y-1"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
