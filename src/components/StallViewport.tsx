
import { CraftingStation } from './CraftingStation';
import { CustomerQueue } from './CustomerQueue';

interface Props {
  cookingSlots: any[];
  customer: any;
  onDeliver: (idx: number) => void;
  items: any[];
  phoneRinging: boolean;
  onPhoneClick: () => void;
}

export function StallViewport({ cookingSlots, customer, onDeliver, items, phoneRinging, onPhoneClick }: Props) {
  return (
    <div className="flex-1 relative bg-gradient-to-b from-[#1e1b4b] to-[#b45309] overflow-visible">
      {/* Background Elements */}
      <div className="absolute top-4 left-0 w-full h-1 bg-black/20 transform -skew-y-3" />
      
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-[40%] bg-[#334155] border-t-4 border-[#1e293b]">
        <div className="w-16 h-2 bg-[#475569] mt-2 ml-4" />
      </div>

      {/* Dog */}
      <div className="absolute bottom-4 left-2 flex items-end animate-pulse z-0">
        <div className="w-[24px] h-[18px] bg-[#ca8a04] border-2 border-[#1c1917]" />
        <div className="w-[14px] h-[14px] bg-[#ca8a04] border-2 border-[#1c1917] -ml-1 mb-1" />
        <span className="absolute -top-4 left-2 text-[10px] font-['VT323'] text-white drop-shadow-md">Zzz</span>
      </div>

      <CraftingStation cookingSlots={cookingSlots} onDeliver={onDeliver} items={items} />
      <CustomerQueue customer={customer} items={items} />

      {/* Phone Scam */}
      <div 
        onClick={phoneRinging ? onPhoneClick : undefined}
        className={`absolute top-[50%] left-[5%] w-[24px] h-[20px] bg-[#1c1917] border-2 border-[#fef3c7] rounded-sm cursor-pointer z-40 ${phoneRinging ? 'animate-shake border-red-500' : ''}`}
      >
        {phoneRinging && <div className="absolute -top-6 text-white text-sm font-['VT323'] text-red-500 drop-shadow-md">Reng!</div>}
      </div>
    </div>
  );
}
