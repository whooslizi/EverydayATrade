import { useGameStore } from '../store/useGameStore';
import { DialogueModal, Choice } from './DialogueModal';

export function WeddingCutscene() {
  const store = useGameStore();

  const choices: Choice[] = [];
  if (store.cash >= 540000) {
    choices.push({
      label: '[ Mung 500.000d ] (Du von tra no)',
      action: () => {
        store.attendWedding(500000);
        store.receiveNguyenGift();
        store.setStage('NIGHT_SETTLEMENT');
      }
    });
  }
  
  choices.push({
    label: '[ Mung toan bo tien tui ] (Doc can vi, giu lai 40k ve xe)',
    action: () => {
      store.attendWedding(store.cash - 40000);
      store.receiveNguyenGift();
      store.setStage('NIGHT_SETTLEMENT');
    }
  });

  choices.push({
    label: '[ Di tay khong ]',
    action: () => {
      store.attendWedding(0);
      store.setStage('NIGHT_SETTLEMENT');
    }
  });

  return (
    <div className="absolute inset-0 bg-[#0c0a09] font-game">
      <div className="absolute inset-0 bg-gradient-to-b from-[#7f1d1d] to-[#0c0a09] opacity-30" />
      <div className="absolute top-10 left-0 right-0 text-center text-[#facc15] font-pixel text-2xl drop-shadow-[2px_2px_0px_#000]">
        Đám Cưới Ở Bắc Giang
      </div>
      <DialogueModal 
        speakerId="khanh"
        speakerName="Khánh"
        text="May den la quy roi. Ngay o ky tuc, may tra tien mang cho ca lu ca nam troi bon tao con chua tinh. Uong di, say thi ngu lai, mai tinh tiep."
        choices={choices}
      />
    </div>
  );
}