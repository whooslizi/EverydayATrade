import { useGameStore } from '../store/useGameStore';
import { DialogueModal, Choice } from './DialogueModal';

export function JailCell() {
  const store = useGameStore();

  const choices: Choice[] = [
    {
      label: '[ Cung vuot nguc voi Anh Tom ]',
      action: () => {
        store.setJailChoice('ESCAPE');
        store.resolveJail();
      }
    },
    {
      label: '[ Can ngan 2 nguoi dung cai nhau nua ]',
      action: () => {
        store.setJailChoice('INTERVENE');
        store.resolveJail();
      }
    },
    {
      label: '[ Im lang nam xuong ngu ]',
      action: () => {
        store.setJailChoice('SLEEP');
        store.resolveJail();
      }
    }
  ];

  return (
    <div className="absolute inset-0 bg-[#0c0a09] font-game">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09] opacity-80" />
      <div className="absolute top-10 left-0 right-0 text-center text-[#ef4444] font-pixel text-2xl drop-shadow-[2px_2px_0px_#000]">
        Buồng Tạm Giam
      </div>
      <DialogueModal 
        speakerId="anh_tom"
        speakerName="Anh Tôm"
        text="Hoc Bach khoa cho lam vao! Doc bao nhieu sach vo roi sau nay ve ban dem cho me a?! Ra ngoai nay theo tao, 3 ngay bang may cay ca nam."
        choices={choices}
      />
    </div>
  );
}