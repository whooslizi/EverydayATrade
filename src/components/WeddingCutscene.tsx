import React, { useState } from 'react';
import audioManager from '../audio/AudioManager';
import useGameStore from '../store/useGameStore';
import { DialogueModal, Choice } from './DialogueModal';

type Phase = 'GREETING' | 'GIFT_CHOICE' | 'NGUYEN_GIFT' | 'DONE';

const WeddingCutscene: React.FC = () => {
  const cash = useGameStore((s) => s.cash);
  const attendWedding = useGameStore((s) => s.attendWedding);
  const receiveNguyenGift = useGameStore((s) => s.receiveNguyenGift);
  const setStage = useGameStore((s) => s.setStage);
  const [phase, setPhase] = useState<Phase>('GREETING');

  const giftChoices: Choice[] = [
    { label: 'MỪNG 500.000đ', value: '500000' },
    { label: 'MỪNG TOÀN BỘ TIỀN TÚI', value: String(cash) },
    { label: 'ĐI TAY KHÔNG', value: '0' },
  ];

  const handleGreetingComplete = () => {
    setPhase('GIFT_CHOICE');
  };

  const handleGiftChoice = (choice: Choice) => {
    audioManager.playSfx('click');
    const amount = parseInt(choice.value, 10);
    attendWedding(amount);
    setPhase('NGUYEN_GIFT');
  };

  const handleNguyenComplete = () => {
    receiveNguyenGift();
    setStage('MORNING_PHASE');
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      <div
        className="absolute inset-0 bg-[#fde047] bg-cover bg-center"
        style={{ backgroundImage: 'url(/backgrounds/wedding_tent.png)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4">
        {phase === 'GREETING' && (
          <DialogueModal
            dialogues={[
              {
                speaker: 'Khanh',
                text: 'Mày đến là quý rồi. Ngày ở ký túc, mày trả tiền mạng cho cả lũ cả năm trời bọn tao còn chưa tính. Uống đi, say thì ngủ lại, mai tính tiếp.',
              },
            ]}
            onComplete={handleGreetingComplete}
          />
        )}

        {phase === 'GIFT_CHOICE' && (
          <DialogueModal
            dialogues={[
              {
                speaker: 'He thong',
                text: 'May muon mung bao nhieu?',
              },
            ]}
            choices={giftChoices}
            onChoice={handleGiftChoice}
            onComplete={() => {}}
          />
        )}

        {phase === 'NGUYEN_GIFT' && (
          <DialogueModal
            dialogues={[
              {
                speaker: 'Nguyen',
                text: 'Khi nao lam lai duoc thi tra tao sau, dung de con Dung chet doi.',
              },
            ]}
            onComplete={handleNguyenComplete}
          />
        )}
      </div>
    </div>
  );
};

export default WeddingCutscene;