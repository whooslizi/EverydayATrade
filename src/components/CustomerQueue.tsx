
import { useGameStore } from '../store/useGameStore';
import { CUSTOMER_DIALOGUES } from '../data/dialogues';

export function CustomerQueue({ customer, items }: any) {
  if (!customer.active) return null;

  const orderItem = items.find((i: any) => i.id === customer.order);

  return (
    <div className="absolute bottom-16 right-6 flex flex-col items-center z-20">
      {/* Order Bubble */}
      <div className="bg-white border-2 border-[#1c1917] p-1 rounded-md mb-2 relative animate-bounce shadow-md">
        <span className="text-[16px]">{orderItem?.icon}</span>
        <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-white border-b-2 border-r-2 border-[#1c1917] transform -translate-x-1/2 rotate-45" />
      </div>
      {/* Customer Sprite */}
      <div className="w-[24px] h-[44px] bg-[#15803d] border-2 border-[#1c1917] shadow-sm relative">
        <div className="absolute top-1 left-1 w-[6px] h-[6px] bg-[#fef3c7]" />
      </div>
      {/* Patience Meter */}
      <div className="w-[32px] h-[6px] bg-[#1c1917] mt-1 border border-[#1c1917]">
        <div 
          className={`h-full transition-all duration-200 ${(customer.patience / 12000) > 0.5 ? 'bg-[#34d399]' : (customer.patience / 12000) > 0.25 ? 'bg-[#facc15]' : 'bg-[#ef4444]'}`} 
          style={{ width: `${(customer.patience / 12000) * 100}%` }} 
        />
      </div>
    </div>
  );
}
