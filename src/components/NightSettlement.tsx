// ====== NIGHT SETTLEMENT PHASE ======
import { useGameStore } from '../store/useGameStore';
import { formatVND, NPCS } from '../data/gameData';
import { audioManager } from '../audio/AudioManager';;
import { useState } from 'react';

export function NightSettlement() {
  const store = useGameStore();
  const [npcDialogue, setNpcDialogue] = useState<{ name: string; text: string; color: string } | null>(null);

  // Random NPC interaction at night
  const triggerNPC = () => {
    const friendlyNPCs = NPCS.filter((n) => ['tra', 'ngoc', 'bang', 'nhung'].includes(n.id));
    const npc = friendlyNPCs[Math.floor(Math.random() * friendlyNPCs.length)];
    const d = npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
    const text = typeof d === 'string' ? d : d.text;
    setNpcDialogue({ name: npc.name, text: text, color: npc.color || '#fff' });

    // Trà feeds Dũng sometimes
    if (npc.id === 'tra' && store.dog.hunger < 40) {
      store.buyFood(0, 20, 0, true, 'Trà cho Dũng ăn');
      store.addLog(' Trà lén cho Dũng miếng xương.');
    }
  };

  const handleEndDay = () => {
    if (store.isSoundOn) audioManager.playBlipSFX();
    store.endDay();
  };

  return (
    <div className="absolute inset-0 night-gradient flex flex-col">
      <div className="text-center py-3">
        <span className="font-pixel text-parchment text-base tracking-wider">
           ĐÊM NGÀY {store.day}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-2">
        {/* Daily summary */}
        <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg">
          <div className="text-sm font-pixel text-[#e8dcdc] mb-2"> Kết Toán Ngày {store.day}</div>
          <div className="grid grid-cols-2 gap-1 text-[9px] font-game text-[#e8dcdc]/80">
            <div> Đã bán:</div>
            <div className="text-right">{store.soldToday} món</div>
            <div> Doanh thu:</div>
            <div className="text-right text-green-700">{formatVND(store.revenueTodayGross)}</div>
            <div> Tiền còn:</div>
            <div className="text-right font-bold">{formatVND(store.cash)}</div>
            <div className="col-span-2 h-px bg-dark-brown/10 my-0.5" />
            <div> Nợ hiện tại:</div>
            <div className="text-right text-red-accent font-bold">{formatVND(store.debt)}</div>
            <div> Lãi đêm nay:</div>
            <div className="text-right text-red-accent">+{formatVND(store.dailyInterest)}</div>
            <div> Nợ sáng mai:</div>
            <div className="text-right text-red-accent font-bold">{formatVND(store.debt + store.dailyInterest)}</div>
          </div>
        </div>

        {/* Dog check */}
        <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">{store.dog.hunger > 30 ? '' : ''}</span>
            <div>
              <div className="text-[9px] font-pixel text-[#e8dcdc]">Dũng</div>
              <div className="text-sm text-[#e8dcdc]/60 font-game">
                Bụng: {store.dog.hunger}% | Trung thành: {store.dog.loyalty}%
              </div>
            </div>
          </div>
          {store.dog.hunger < 25 && (
            <p className="text-sm text-red-accent font-game mt-1 italic">
              ️ Dũng rên rỉ đói... Loyalty -12 mỗi đêm nếu không cho ăn!
            </p>
          )}
          {store.dog.loyalty <= 15 && store.dog.hunger < 20 && (
            <p className="text-sm text-red-accent font-pixel mt-1 animate-pixel-blink">
               CẢNH BÁO: Dũng sắp bỏ đi về với Cụ Bá!
            </p>
          )}
        </div>

        {/* NPC encounter */}
        {!npcDialogue && (
          <button
            onClick={triggerNPC}
            className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg w-full text-center hover:bg-amber-50 transition-colors"
          >
            <span className="text-[9px] font-pixel text-[#e8dcdc]">
               Tán gẫu với hàng xóm...
            </span>
          </button>
        )}

        {npcDialogue && (
          <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg animate-slide-up">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-base font-bold"
                style={{ backgroundColor: npcDialogue.color + '30', color: npcDialogue.color }}
              >
                {npcDialogue.name[0]}
              </div>
              <span className="text-[9px] font-pixel" style={{ color: npcDialogue.color }}>
                {npcDialogue.name}
              </span>
            </div>
            <p className="text-[9px] text-[#e8dcdc] font-game italic">
              {npcDialogue.text}
            </p>
          </div>
        )}

        {/* Danger warnings */}
        {store.taxSuspicion > 60 && (
          <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg border-red-accent/50">
            <p className="text-sm text-red-accent font-game">
               Thuế vụ: {store.taxSuspicion}% — Nguy hiểm! Bán bình dân để giảm.
            </p>
          </div>
        )}
        {store.mobAnger > 60 && (
          <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg border-orange-500/50">
            <p className="text-sm text-orange-600 font-game">
               Phẫn nộ tổ dân phố: {store.mobAnger}% — Coi chừng bị đập!
            </p>
          </div>
        )}

        {/* Log */}
        {store.log.length > 0 && (
          <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg max-h-[80px] overflow-y-auto">
            <div className="text-sm font-pixel text-[#e8dcdc]/50 mb-0.5"> Sự kiện</div>
            {store.log.slice(-6).map((entry, i) => (
              <p key={i} className="text-sm text-[#e8dcdc]/70 font-game">{entry}</p>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 space-y-1">
        {store.cash >= 100000 && store.debt > 0 && (
          <button
            onClick={() => {
              const amount = Math.min(store.cash - 30000, store.debt);
              if (amount > 0) {
                store.payDebt(amount);
                if (store.isSoundOn) audioManager.playCoinSFX();
              }
            }}
            className="bg-[#2d2222] text-[#fdf6e2] font-bold py-3 px-4 rounded-[12px] border-2 border-[#3e3030] hover:bg-[#3e3030] transition-all text-[9px] px-3 py-1.5 w-full"
          >
             Trả nợ Cụ Bá (giữ lại 30k)
          </button>
        )}
        <button
          onClick={handleEndDay}
          className="bg-[#fcc419] text-[#1a1414] font-bold py-3 px-4 rounded-[12px] shadow-[0_4px_0_#e67700] hover:bg-[#fab005] active:translate-y-1 active:shadow-none transition-all w-full text-sm px-4 py-2.5 w-full tracking-wide"
        >
           Ngủ — Chuyển Sang Ngày Mới
        </button>
      </div>
    </div>
  );
}
