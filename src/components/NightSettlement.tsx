import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { NPCS, NIGHT_VOICES, checkEndingConditions } from '../data/gameData';

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'd';
}

export function NightSettlement() {
  const store = useGameStore();
  const [phase, setPhase] = useState<'summary' | 'npc' | 'voice'>('summary');
  const [npcDialogue, setNpcDialogue] = useState<{ name: string; text: string } | null>(null);

  const triggerNPC = () => {
    const friendlyNPCs = NPCS.filter(n => ['tra', 'ngoc', 'bang', 'nhung'].includes(n.id));
    const npc = friendlyNPCs[Math.floor(Math.random() * friendlyNPCs.length)];
    const d = npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
    const text = typeof d === 'string' ? d : d.text;
    setNpcDialogue({ name: npc.name, text });
    if (npc.id === 'tra' && store.dog.hunger < 40) {
      store.buyFood(0, 20, 0, true, 'Trà cho Dũng ăn');
      store.addLog('Trà lén cho Dũng miếng xương.');
    }
    setPhase('npc');
  };

  const triggerVoice = () => {
    setPhase('voice');
    store.setNightVoiceShown(true);
  };

  const handleEndDay = () => {
    const endingId = checkEndingConditions(store);
    if (endingId) {
      const current = store.endingsUnlocked || [];
      if (!current.includes(endingId)) {
        useGameStore.setState({ endingsUnlocked: [...current, endingId] });
      }
      store.triggerEnding(endingId);
    } else {
      store.endDay();
    }
    audioManager.playBlipSFX();
  };

  const voice = NIGHT_VOICES[Math.min(store.day - 1, NIGHT_VOICES.length - 1)];

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0c0a09] overflow-y-auto custom-scrollbar">
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h2 className="font-[VT323] text-2xl text-[#fbc02d] pixel-text-shadow uppercase text-center">
          ĐÊM NGÀY {store.day}
        </h2>

        {phase === 'summary' && (
          <>
            <div className="pixel-panel p-3">
              <h3 className="font-[VT323] text-lg text-[#3e2723] uppercase mb-2">KẾT QUẢ HÔM NAY</h3>
              <table className="w-full font-[Share_Tech_Mono] text-sm text-[#3e2723]">
                <tbody>
                  <tr><td>Doanh thu:</td><td className="text-right text-[#15803d]">{formatVND(store.revenueTodayGross)}</td></tr>
                  <tr><td>Bán được:</td><td className="text-right">{store.soldToday} món</td></tr>
                  <tr><td>Lãi đêm nay:</td><td className="text-right text-[#d32f2f]">-{formatVND(store.dailyInterest)}</td></tr>
                  <tr><td>Tiền còn lại:</td><td className="text-right font-bold">{formatVND(store.cash)}</td></tr>
                </tbody>
              </table>
            </div>

            <button onClick={triggerNPC} className="pixel-btn pixel-btn-gold w-full font-[VT323] text-lg">
              TRƯỚC KHI NGỦ...
            </button>
          </>
        )}

        {phase === 'npc' && npcDialogue && (
          <>
            <div className="pixel-panel p-3">
              <h3 className="font-[VT323] text-lg text-[#fbc02d] uppercase mb-2">{npcDialogue.name}</h3>
              <p className="font-[Share_Tech_Mono] text-sm text-[#3e2723] italic leading-relaxed">"{npcDialogue.text}"</p>
            </div>
            <button onClick={triggerVoice} className="pixel-btn pixel-btn-gray w-full font-[VT323] text-lg">
              TIẾP TỤC
            </button>
          </>
        )}

        {phase === 'voice' && (
          <>
            <div className="pixel-panel-dark p-4 border-2 border-[#78471c]">
              <h3 className="font-[VT323] text-lg text-[#fbc02d] uppercase mb-2">Giọng nói Ông Đào</h3>
              <p className="font-[Share_Tech_Mono] text-base text-[#f4ecd8] italic leading-relaxed">"{voice}"</p>
            </div>
          </>
        )}
      </div>

      <div className="sticky bottom-0 p-3 bg-[#0c0a09] border-t-4 border-[#78471c]">
        <button onClick={handleEndDay} className="pixel-btn pixel-btn-red w-full font-[VT323] text-2xl py-3">
          BẮT ĐẦU NGỦ
        </button>
      </div>
    </div>
  );
}
