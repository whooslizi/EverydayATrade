
import { useGameStore } from '../store/useGameStore';
import { DialogueModal, Choice } from './DialogueModal';

export function WeddingCutscene() {
  const store = useGameStore();

  const choices: Choice[] = [];
  if (store.cash >= 540000) {
    choices.push({ label: '[ MỪNG 500.000đ ] (Đủ vốn trả nợ)', action: () => { store.attendWedding(500000); store.receiveNguyenGift(); store.setStage('NIGHT_SETTLEMENT'); } });
  }
  choices.push({ label: '[ MỪNG TOÀN BỘ TIỀN TÚI ]', action: () => { store.attendWedding(store.cash - 40000); store.receiveNguyenGift(); store.setStage('NIGHT_SETTLEMENT'); } });
  choices.push({ label: '[ ĐI TAY KHÔNG ]', action: () => { store.attendWedding(0); store.setStage('NIGHT_SETTLEMENT'); } });

  return (
    <div className="absolute inset-0 bg-[#0c0a09] font-game">
      <DialogueModal 
        speakerId="khanh"
        speakerName="Khánh"
        text="Mày đến là quý rồi. Ngày ở ký túc, mày trả tiền mạng cho cả lũ cả năm trời bọn tao còn chưa tính. Uống đi, say thì ngủ lại, mai tính tiếp."
        choices={choices}
      />
    </div>
  );
}
