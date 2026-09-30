
import { useGameStore } from '../store/useGameStore';

interface Props {
  cookingSlots: any[];
  customer: any;
  onDeliver: (idx: number) => void;
  items: any[];
  phoneRinging: boolean;
  onPhoneClick: () => void;
}

export function StallViewport({ cookingSlots, customer, onDeliver, items, phoneRinging, onPhoneClick }: Props) {
  // Purely DOM/CSS based rich pixel rendering
  return (
    <div className="flex-1 relative bg-gradient-to-b from-[#1e1b4b] to-[#b45309] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-4 left-0 w-full h-1 bg-black/20 transform -skew-y-3" />
      <div className="absolute top-12 left-0 w-full h-[1px] bg-black/30 transform skew-y-2" />
      
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-[40%] bg-[#334155] border-t-4 border-[#1e293b]">
        {/* Curb details */}
        <div className="w-16 h-2 bg-[#475569] mt-2 ml-4" />
        <div className="w-8 h-2 bg-[#475569] mt-1 ml-24" />
      </div>

      {/* Dog */}
      <div className="absolute bottom-2 left-2 flex items-end animate-pulse">
        <div className="w-[20px] h-[16px] bg-[#ca8a04] border-2 border-black" />
        <div className="w-[12px] h-[12px] bg-[#ca8a04] border-2 border-black -ml-1 mb-1" />
        <span className="absolute -top-4 left-2 text-[10px] font-[VT323] text-white drop-shadow-md">Zzz</span>
      </div>

      {/* Cart/Stall */}
      <div className="absolute bottom-6 left-[20%] w-[120px] h-[70px] bg-[#78350f] border-4 border-[#451a03] shadow-lg flex flex-col justify-end p-1">
        <div className="absolute -top-8 left-1 w-[110px] h-[16px] bg-[#991b1b] border-2 border-[#450a0a] text-center font-[VT323] text-[10px] text-[#facc15] shadow-sm transform -rotate-2">
          HÀNG NGON
        </div>
        <div className="flex gap-2">
          {cookingSlots.map((slot, idx) => (
            <div key={idx} className="relative w-[40px] h-[30px] bg-[#a1a1aa] border-2 border-[#3f3f46] flex items-end justify-center rounded-sm">
              {slot.state === 'cooking' && (
                <div className="absolute -top-6 text-white text-[10px] animate-bounce">♨</div>
              )}
              {slot.state !== 'idle' && (
                <div 
                  onClick={() => onDeliver(idx)}
                  className={`absolute -top-8 w-[24px] h-[24px] border-2 flex items-center justify-center cursor-pointer ${slot.state === 'burnt' ? 'bg-black border-red-500' : 'bg-white border-[#15803d]'}`}
                >
                  <span className="text-[12px]">{items.find(i => i.id === slot.itemId)?.icon || '?'}</span>
                </div>
              )}
              {slot.state === 'cooking' && (
                <div className="w-full h-1 bg-black absolute bottom-0 left-0">
                  <div className="h-full bg-[#15803d]" style={{ width: `${slot.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer */}
      {customer.active && (
        <div className="absolute bottom-8 right-6 flex flex-col items-center">
          {/* Order Bubble */}
          <div className="bg-white border-2 border-black p-1 rounded-md mb-2 relative">
            <span className="text-[14px]">{items.find(i => i.id === customer.order)?.icon}</span>
            <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-white border-b-2 border-r-2 border-black transform -translate-x-1/2 rotate-45" />
          </div>
          {/* Sprite */}
          <div className="w-[24px] h-[40px] bg-[#15803d] border-2 border-black animate-bounce" />
          {/* Patience Bar */}
          <div className="w-[30px] h-1 bg-black mt-1">
            <div className="h-full bg-[#facc15]" style={{ width: `${(customer.patience / 12000) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Phone Scam */}
      <div 
        onClick={phoneRinging ? onPhoneClick : undefined}
        className={`absolute bottom-[80px] left-[10%] w-[20px] h-[16px] bg-[#1c1917] border-2 border-black rounded-sm cursor-pointer ${phoneRinging ? 'animate-shake border-red-500' : ''}`}
      >
        {phoneRinging && <div className="absolute -top-4 text-white text-xs font-[VT323] text-red-500 drop-shadow-md">Reng!</div>}
      </div>

    </div>
  );
}
