
import { audioManager } from '../audio/AudioManager';

export function CraftingStation({ cookingSlots, onDeliver, items }: any) {
  return (
    <div className="absolute bottom-6 left-[10%] w-[150px] h-[80px] bg-[#78350f] border-4 border-[#451a03] shadow-[0_5px_0_rgba(0,0,0,0.5)] flex flex-col justify-end p-2 z-10">
      <div className="absolute -top-6 left-2 w-[130px] h-[20px] bg-[#991b1b] border-2 border-[#450a0a] text-center font-['VT323'] text-[14px] text-[#facc15] shadow-sm transform -rotate-1 z-20">
        KHU VỰC CHẾ TẠO
      </div>
      <div className="flex gap-2 justify-center w-full relative z-30">
        {cookingSlots.map((slot: any, idx: number) => {
          const itemDef = items.find((i: any) => i.id === slot.itemId);
          return (
            <div key={idx} className="relative w-[44px] h-[36px] bg-[#a1a1aa] border-2 border-[#3f3f46] flex flex-col items-center justify-end rounded-sm shadow-inner">
              {slot.state === 'cooking' && (
                <div className="absolute -top-6 text-white text-[12px] animate-bounce drop-shadow-md">♨</div>
              )}
              {slot.state !== 'idle' && (
                <div className="absolute -top-8 w-[28px] h-[28px] bg-white border-2 border-[#1c1917] flex items-center justify-center rounded-sm shadow-md">
                  <span className="text-[16px]">{itemDef?.icon || '?'}</span>
                </div>
              )}
              
              {/* Progress Bar */}
              {slot.state === 'cooking' && (
                <div className="w-full h-[6px] bg-[#1c1917] border-t border-[#3f3f46]">
                  <div className="h-full bg-[#facc15]" style={{ width: `${slot.progress}%` }} />
                </div>
              )}

              {/* Delivery Button / Ready State */}
              {(slot.state === 'done' || slot.state === 'burnt') && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[54px] z-50">
                  <button 
                    onClick={() => onDeliver(idx)}
                    className={`w-full py-1 text-white font-['VT323'] text-[12px] border-2 shadow-[0_2px_0_#1c1917] ${slot.state === 'burnt' ? 'bg-[#ef4444] border-[#7f1d1d]' : 'bg-[#15803d] border-[#14532d] hover:bg-[#166534] active:translate-y-0.5'}`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    GIAO MÓN
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
