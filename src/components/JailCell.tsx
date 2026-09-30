
import { useGameStore } from '../store/useGameStore';
import { DialogueModal, Choice } from './DialogueModal';

export function JailCell() {
  const store = useGameStore();

  const choices: Choice[] = [
    { label: '[ Cùng vượt ngục với Anh Tôm ]', action: () => { store.setJailChoice('ESCAPE'); store.resolveJail(); } },
    { label: '[ Can ngăn 2 người đừng cãi nhau nữa ]', action: () => { store.setJailChoice('INTERVENE'); store.resolveJail(); } },
    { label: '[ Im lặng nằm xuống ngủ ]', action: () => { store.setJailChoice('SLEEP'); store.resolveJail(); } }
  ];

  return (
    <div className="absolute inset-0 bg-[#0c0a09] font-game">
      <DialogueModal 
        speakerId="anh_tom"
        speakerName="Anh Tôm"
        text="Học Bách khoa cho lắm vào! Đọc bao nhiêu sách vở rồi sau này về bán dế cho mẹ à?! Ra ngoài này theo tao, 3 ngày bằng mày cày cả năm."
        choices={choices}
      />
    </div>
  );
}
