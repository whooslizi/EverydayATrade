import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

const REQUIRED_ENDINGS = 7;

export function DisclaimerScreen() {
  const unlockedCount = useGameStore((s) => s.endingsUnlocked.length);
  const isSoundOn = useGameStore((s) => s.isSoundOn);
  const setStage = useGameStore((s) => s.setStage);

  const agree = () => {
    if (isSoundOn) audioManager.playBlipSFX();
    if (unlockedCount >= REQUIRED_ENDINGS) {
      setStage('MEMORIAL');
      return;
    }
    alert(
      `Mới mở khóa ${unlockedCount}/${REQUIRED_ENDINGS} kết cục. Hãy thu thập đủ ${REQUIRED_ENDINGS} kết cục để mở khóa Ký ức cuối cùng của Ông Đào.`,
    );
    setStage('TITLE');
  };

  const disagree = () => {
    if (isSoundOn) audioManager.playBlipSFX();
    setStage('TITLE');
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#1a1414]/90 z-50 p-4 select-none">
      <div className="pixel-panel w-full max-w-[380px] max-h-[90%] flex flex-col items-center animate-slide-up relative">
        <h1
          className="font-['VT323'] text-[24px] leading-tight mb-3 text-center text-[#ff6b6b] uppercase tracking-wide drop-shadow-[2px_2px_0px_#000]"
        >
          THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM & ĐÍNH CHÍNH
        </h1>
        <div className="flex-1 min-h-0 overflow-y-auto mb-4 w-full space-y-3 font-['Share_Tech_Mono'] text-[15px] leading-relaxed text-[#e8dcdc] drop-shadow-[2px_2px_0px_#000]">
          <p>
            Trò chơi 'Mỗi Ngày Một Nghề' là sản phẩm hư cấu hoàn toàn, phục vụ mục đích giải trí và trải nghiệm mô phỏng
            sinh tồn hè phố.
          </p>
          <p>
            Mọi danh xưng, bối cảnh, nghề nghiệp và tuyến nhân vật (như chú chó Dũng, anh Tôm buôn thực phẩm giả, bạn Hà,
            Hoàng IT, sinh viên Bách khoa, phong trào xóa game PUBG,...) hoàn toàn mang tính chất xây dựng kịch bản trào
            phúng.
          </p>
          <p>
            Tác phẩm tuyệt đối KHÔNG có ý định ám chỉ, bôi nhọ, xúc phạm, đánh đồng hay đại diện cho bất kỳ cá nhân, tổ
            chức hay nguyên mẫu ngoài đời thực nào. Mọi sự trùng hợp về danh xưng hay tình huống đều là ngẫu nhiên.
          </p>

          <div className="bg-[#2a1414] border-2 border-[#4a2424] border-l-8 border-l-[#facc15] p-4 shadow-[0_3px_0_#1a0a0a] mt-2 mb-2">
            <div className="font-['VT323'] text-[22px] leading-none text-[#facc15] mb-3 drop-shadow-[2px_2px_0px_#000]">
              LỜI NGỎ TỪ NHÓM PHÁT TRIỂN
            </div>
            <div className="text-[15px] leading-relaxed text-[#fef3c7] space-y-3 font-['Share_Tech_Mono']">
              <p>
                Trước hết, tụi mình xin gửi lời cảm ơn chân thành nhất vì bạn đã dành thời gian trải nghiệm tựa game này! Hy vọng bạn đã có những giây phút sinh tồn hè phố thật thú vị và đáng nhớ.
              </p>
              <p>
                Trò chơi này là một phần trong dự án nghiên cứu của nhóm. Rất mong bạn nán lại chút xíu để giúp nhóm điền bảng <strong>"Khảo sát cảm nhận người chơi giữa tranh AI và nghệ thuật lập trình"</strong> <a href="https://forms.gle/5yWWoib1NpDqdP6fA" target="_blank" rel="noopener noreferrer" className="text-[#facc15] underline decoration-2 underline-offset-2 hover:text-white">tại đây</a> nhé. Mọi ý kiến của bạn đều cực kỳ quý giá!
              </p>
              <p>
                Ngoài ra, dự án này được public mã nguồn mở (opensource). Bạn có thể truy cập toàn bộ code qua <a href="https://github.com/whooslizi/EverydayaTrade" target="_blank" rel="noopener noreferrer" className="text-[#facc15] underline decoration-2 underline-offset-2 hover:text-white">link Github này</a>. Nếu thấy hay, đừng ngại đóng góp (contribute) hoặc tặng nhóm một sao (star) nha :))
              </p>
              <div className="border-t border-[#4a2424] pt-3 mt-4 text-center italic text-[#ff6b6b]">
                A grand game made in loving memory of the author's grandfather.
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full shrink-0">
          <button onClick={agree} className="flex-1 pixel-btn-red font-['VT323'] text-[20px] drop-shadow-[2px_2px_0px_#000]">
            TÔI ĐỒNG TÌNH
          </button>
          <button onClick={disagree} className="flex-1 pixel-btn-gray font-['VT323'] text-[20px] drop-shadow-[2px_2px_0px_#000]">
            TÔI KHÔNG ĐỒNG TÌNH
          </button>
        </div>
      </div>
    </div>
  );
}
