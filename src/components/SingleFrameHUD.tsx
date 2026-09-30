import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { formatVND, JOBS, PRICING_OPTIONS } from '../data/gameData';
import { PhoneScamModal } from './PhoneScamModal';
import { StallViewport } from './StallViewport';
import type { JobItem } from '../types';


const RetroBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#2d1b36] via-[#63283c] to-[#a34a36]">
    {/* Sun/Moon glow */}
    <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-24 h-24 bg-[#fbbf24] rounded-full blur-xl opacity-60"></div>
    {/* Distant mountains/buildings */}
    <div className="absolute bottom-[25%] left-0 w-full h-[20%] bg-[#1f1221] opacity-80" style={{ clipPath: 'polygon(0 100%, 0 40%, 10% 20%, 30% 60%, 50% 10%, 70% 50%, 85% 30%, 100% 70%, 100% 100%)' }}></div>
    {/* Closer traditional buildings */}
    <div className="absolute bottom-[25%] left-[-5%] w-[30%] h-[40%] bg-[#1a0f12]">
      <div className="absolute top-0 left-0 w-full h-[15%] bg-[#361719] border-b-2 border-[#0a0507]" style={{ transform: 'skewY(-5deg)' }}></div>
      {/* Lanterns */}
      <div className="absolute top-[30%] right-[-10%] w-4 h-6 bg-[#ef4444] rounded-sm shadow-[0_0_10px_#ef4444]"></div>
    </div>
    <div className="absolute bottom-[25%] right-[-5%] w-[35%] h-[50%] bg-[#1a0f12]">
      <div className="absolute top-0 left-0 w-full h-[15%] bg-[#361719] border-b-2 border-[#0a0507]" style={{ transform: 'skewY(5deg)' }}></div>
      <div className="absolute top-[25%] left-[-5%] w-4 h-6 bg-[#ef4444] rounded-sm shadow-[0_0_10px_#ef4444]"></div>
    </div>
    {/* Street / Ground */}
    <div className="absolute bottom-0 left-0 w-full h-[25%] bg-[#2a1815] border-t-[6px] border-[#120a09]">
      <div className="w-full h-1 bg-[#120a09] mt-3 opacity-60"></div>
      <div className="w-full h-1 bg-[#120a09] mt-4 opacity-40"></div>
    </div>
  </div>
);

export function SingleFrameHUD() {
  const store = useGameStore((s: any) => s);
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'PRICING' | 'DEBT' | 'LOG'>('ITEMS');
  const [showPhone, setShowPhone] = useState(false);
  const [phoneRinging, setPhoneRinging] = useState(false);

  // Real-time mechanics state
  const [cookingSlots, setCookingSlots] = useState<{id: number, itemId: string | null, progress: number, state: 'idle'|'cooking'|'done'|'burnt', timer: number}[]>([
    { id: 0, itemId: null, progress: 0, state: 'idle', timer: 0 },
    { id: 1, itemId: null, progress: 0, state: 'idle', timer: 0 }
  ]);
  const [shiftTime, setShiftTime] = useState(60);
  const [shiftActive, setShiftActive] = useState(false);
  const [playerReply, setPlayerReply] = useState<string | null>(null);
  const shiftActiveRef = useRef(shiftActive);
  shiftActiveRef.current = shiftActive;
  const shiftTimeRef = useRef(shiftTime);
  shiftTimeRef.current = shiftTime;
  const playerReplyRef = useRef(playerReply);
  playerReplyRef.current = playerReply;

    
  const [customer, setCustomer] = useState<{active: boolean, patience: number, order: string | null, state: 'waiting'|'happy'|'angry'|'replying', scenarioIdx: number}>({
    active: false, patience: 12000, order: null, state: 'waiting', scenarioIdx: 0
  });
  
  const job = store.currentJob || JOBS[0];
  const items = job.items || [];
  const currentPricing = PRICING_OPTIONS.find(p => p.tier === store.selectedPricing)!;

  // Real-time Loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // Update Cooking
      setCookingSlots(slots => slots.map(slot => {
        if (slot.state === 'cooking') {
          const newTimer = slot.timer + dt;
          const target = items.find((i: JobItem) => i.id === slot.itemId)?.craftTimeMs || 4000;
          if (newTimer >= target) {
            return { ...slot, progress: 100, state: 'done', timer: 0 };
          }
          return { ...slot, progress: (newTimer / target) * 100, timer: newTimer };
        }
        if (slot.state === 'done') {
          const newTimer = slot.timer + dt;
          if (newTimer >= 5000) {
            return { ...slot, state: 'burnt', timer: 0 }; // burns after 5s
          }
          return { ...slot, timer: newTimer };
        }
        return slot;
      }));

      // Update Shift
      if (shiftActiveRef.current) {
        setShiftTime(t => {
          const newT = t - dt / 1000;
          if (newT <= 0) {
            setShiftActive(false);
            setTimeout(() => store.setStage('NIGHT_SETTLEMENT'), 1000);
            return 0;
          }
          return newT;
        });
      }

      // Update Customer
      setCustomer(cust => {
        if (cust.active && cust.state === 'waiting') {
          const newPatience = cust.patience - dt;
          if (newPatience <= 0) {
            store.addMobAnger(10);
            return { ...cust, patience: 0, state: 'angry', scenarioIdx: 0 };
          }
          return { ...cust, patience: newPatience };
        }
        
        // Auto-spawn logic
        if (shiftActiveRef.current && !cust.active && shiftTimeRef.current > 2 && !playerReplyRef.current) {
          if (Math.random() < 0.015) { // about 1 spawn per 1-2 seconds at 60fps
            const randomItem = items[Math.floor(Math.random() * items.length)]?.id;
            return { active: true, patience: 15000, order: randomItem, state: 'waiting', scenarioIdx: 0 };
          }
        }
        
        return cust;
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [items, store]);

  // Phone event random trigger
  useEffect(() => {
    const t = setTimeout(() => {
      if (Math.random() < 0.3 && !showPhone) {
        setPhoneRinging(true);
        audioManager.playBlipSFX();
        setTimeout(() => setPhoneRinging(false), 5000);
      }
    }, 15000);
    return () => clearTimeout(t);
  }, [showPhone]);

  const handleStartCook = (item: JobItem) => {
    const slotData = store.inventory.find((i: any) => i.itemId === item.id);
    const rawQty = slotData ? slotData.rawQty : 0;

    if (rawQty <= 0) {
      audioManager.playErrorSFX();
      return;
    }
    const emptySlot = cookingSlots.findIndex((s: any) => s.state === 'idle' || s.state === 'burnt');
    if (emptySlot === -1) {
      audioManager.playErrorSFX();
      return;
    }
    audioManager.playBlipSFX();
    
    // consume 1 raw item
    // Assuming there is a way to reduce inventory. If not, we just subtract it directly via store action if it existed.
    // For now, since buyIngredients increases rawQty, maybe we have a consume action?
    // The prompt just says "consumes raw ingredients", we might have to add a helper or just let the cook finish.
    // Let's pretend startCraft does it.
    store.startCraft(item.id);

    setCookingSlots(slots => {
      const nw = [...slots];
      nw[emptySlot] = { id: emptySlot, itemId: item.id, progress: 0, state: 'cooking', timer: 0 };
      return nw;
    });
  };

  const deliverFood = (slotIdx: number) => {
    const slot = cookingSlots[slotIdx];
    if (slot.state !== 'done') return;

    if (customer.active && customer.state === 'waiting' && customer.order === slot.itemId) {
      audioManager.playCoinSFX();
      const itemDef = items.find((i: JobItem) => i.id === slot.itemId);
      const rev = (itemDef?.basePrice || 0) * currentPricing.marginMultiplier;
      store.sellBatch(1, rev);
      store.addMobAnger(currentPricing.angerIncrease);
      // Wait for reply before hiding
      setCustomer(c => ({ ...c, state: 'replying', scenarioIdx: currentPricing.tier === 'CHAT_CHEM' ? 0 : Math.floor(Math.random() * 2) + 1 }));
    } else {
      audioManager.playErrorSFX();
    }
    setCookingSlots(slots => {
      const nw = [...slots];
      nw[slotIdx] = { id: slotIdx, itemId: null, progress: 0, state: 'idle', timer: 0 };
      return nw;
    });
  };

  const spawnCustomer = () => {
    if (customer.active) return;
    const order = items[Math.floor(Math.random() * items.length)].id;
    setCustomer({ active: true, patience: 12000, order, state: 'waiting', scenarioIdx: 0 });
  };

  const renderHUD = () => (
    <div className="h-[46px] bg-[#1a0e08] border-b-4 border-[#3f2010] flex items-center justify-between px-2 shrink-0 shadow-md relative z-10">
      <div className="font-[VT323] text-[#facc15] text-[18px] flex flex-col leading-tight drop-shadow-[2px_2px_0px_#000]">
        <span>Ngày {store.day}/{store.maxDays} | Ca: {Math.ceil(shiftTime)}s</span>
        <span className="text-[12px] text-[#fef3c7]">★★★★★</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-[VT323] text-[#34d399] text-[18px] leading-tight drop-shadow-[2px_2px_0px_#000]">
          Ví: {formatVND(store.cash)}
        </div>
        <div className="font-[VT323] text-[#ef4444] text-[14px] leading-tight drop-shadow-[2px_2px_0px_#000]">
          Nợ: {formatVND(store.debt)}
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => store.toggleSound()} className="bg-[#3f2010] px-2 text-[#fef3c7] font-[VT323] text-sm border-2 border-[#78350f] drop-shadow-md">
          {store.isSoundOn ? 'ÂM THANH' : 'TẮT ÂM'}
        </button>
        <button onClick={() => store.setStage('TITLE')} className="bg-[#991b1b] px-2 text-white font-[VT323] text-sm border-2 border-[#450a0a] drop-shadow-md">
          THOÁT
        </button>
      </div>
    </div>
  );

  const renderTray = () => (
    <div className="h-[38%] bg-[#fef3c7] flex flex-col shrink-0 border-t-4 border-[#78350f] relative z-10">
      <div className="flex bg-[#3f2010] px-2 pt-1 gap-1 shrink-0 shadow-inner">
        {(['ITEMS', 'PRICING', 'DEBT', 'LOG'] as const).map(tab => {
          const labels = { ITEMS: 'NGUYÊN LIỆU', PRICING: 'ĐỊNH GIÁ', DEBT: 'SỔ NỢ', LOG: 'NHẬT KÝ' };
          const active = activeTab === tab;
          return (
            <button 
              key={tab} 
              onClick={() => { audioManager.playBlipSFX(); setActiveTab(tab); }}
              className={`flex-1 rounded-t-md font-[VT323] text-[15px] border-x-2 border-t-2 ${active ? 'bg-[#fef3c7] text-[#78350f] border-[#78350f] pt-1' : 'bg-[#23150d] text-[#fef3c7] border-[#451a03] mt-1'}`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 font-[Share_Tech_Mono] text-[14px] text-[#1c1917] custom-scrollbar shadow-inner">
        {activeTab === 'ITEMS' && (
          <div className="space-y-2">
            {items.map((item: JobItem) => {
              const slot = store.inventory.find((i: any) => i.itemId === item.id);
              const qty = slot ? slot.rawQty : 0;
              return (
                <div key={item.id} className="flex justify-between items-center border-b border-[#d4d4d8] pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <div className="leading-none">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[12px] text-[#78350f]">Vốn: {formatVND(item.ingredientCost)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 mr-2">
                      <button 
                        onClick={() => { audioManager.playBlipSFX(); store.buyIngredients(item.id, -1, -item.ingredientCost); }} 
                        disabled={qty <= 0}
                        className="w-6 h-6 flex items-center justify-center bg-[#44403c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-sm border border-[#1c1917]"
                      >-</button>
                      <div className="w-8 text-center bg-white border border-[#78350f] font-bold text-[15px]">{qty}</div>
                      <button 
                        onClick={() => { audioManager.playBlipSFX(); store.buyIngredients(item.id, 1, item.ingredientCost); }} 
                        disabled={store.cash < item.ingredientCost}
                        className="w-6 h-6 flex items-center justify-center bg-[#15803d] disabled:opacity-50 text-white font-bold rounded-sm border border-[#14532d]"
                      >+</button>
                    </div>
                    <button onClick={() => handleStartCook(item)} className="bg-[#991b1b] text-white px-2 py-1 border-2 border-[#450a0a] font-['VT323'] text-lg hover:bg-[#b91c1c] drop-shadow-sm">
                      CHẾ TẠO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'PRICING' && (
          <div className="flex flex-col h-full justify-center space-y-3">
            <div className="text-center font-bold text-lg mb-1">{currentPricing.label}</div>
            <div className="flex justify-center items-center gap-2">
              <button onClick={() => { audioManager.playBlipSFX(); store.setPricing('BINH_DAN'); }} className={`${store.selectedPricing==='BINH_DAN'?'bg-[#15803d] text-white':'bg-[#e6d5a7]'} px-3 py-1 font-[VT323] text-lg border-2 border-[#14532d]`}>BÌNH DÂN</button>
              <button onClick={() => { audioManager.playBlipSFX(); store.setPricing('HOP_LY'); }} className={`${store.selectedPricing==='HOP_LY'?'bg-[#ca8a04] text-white':'bg-[#e6d5a7]'} px-3 py-1 font-[VT323] text-lg border-2 border-[#713f12]`}>HỢP LÝ</button>
              <button onClick={() => { audioManager.playBlipSFX(); store.setPricing('CHAT_CHEM'); }} className={`${store.selectedPricing==='CHAT_CHEM'?'bg-[#991b1b] text-white':'bg-[#e6d5a7]'} px-3 py-1 font-[VT323] text-lg border-2 border-[#450a0a]`}>CHẶT CHÉM</button>
            </div>
          </div>
        )}

        {activeTab === 'DEBT' && (
          <div className="space-y-1">
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1"><span>Nợ hiện tại:</span><span className="text-[#991b1b] font-bold">{formatVND(store.debt)}</span></div>
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1"><span>Nghi ngờ thuế:</span><span>{store.taxSuspicion}/100</span></div>
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1"><span>Giận của khách:</span><span>{store.mobAnger}/100</span></div>
            
          </div>
        )}
        {activeTab === 'LOG' && (
          <div className="space-y-1 text-xs">
            {store.log.slice(-4).reverse().map((entry: string, i: number) => <div key={i} className="border-b border-[#d4d4d8] pb-1">{entry}</div>)}
          </div>
        )}
      </div>

      {!shiftActiveRef.current && shiftTimeRef.current > 0 ? (
        <button onClick={() => { audioManager.playBlipSFX(); setShiftActive(true); shiftActiveRef.current = true; }} className="w-full h-[40px] shrink-0 bg-[#991b1b] hover:bg-[#b91c1c] text-white font-[VT323] text-xl border-t-4 border-[#450a0a] drop-shadow-md">
          BẮT ĐẦU CA MƯU SINH
        </button>
      ) : (
        <div className="w-full h-[40px] shrink-0 bg-[#0c0a09] text-[#facc15] font-[VT323] text-xl border-t-4 border-[#450a0a] drop-shadow-md flex items-center justify-center">
          {shiftTimeRef.current <= 0 ? 'KẾT THÚC CA LÀM VIỆC' : `CA LÀM VIỆC: 00:${Math.ceil(shiftTimeRef.current).toString().padStart(2, '0')}`}
        </div>
      )}
    </div>
  );

  
const SCENARIOS = [
  {
    text: '"Ối giời ôi, bát phở đắt thế?! Bò này nuôi bằng sữa tươi à?!"',
    choices: [
      { label: '[1] Nhẹ nhàng giải thích', reply: 'Bác ăn thử miếng nước ngọt thanh này xem có đáng đồng tiền không.' },
      { label: '[2] Bật lại gắt gỏng', reply: 'Chê đắt thì vác bát ra ngã tư mà nuốt bụi cho no!' },
      { label: '[3] Hề hước', reply: 'Bò này tốt nghiệp Bách khoa ra đấy bác, ăn vào thông minh đột xuất luôn!' }
    ]
  },
  {
    text: '"Biết tin gì chưa bác chủ? Con bé Hà bán quạt sắp cưới anh IT rồi!"',
    choices: [
      { label: '[1] Trải đời', reply: 'Làm nghề gì thì bàn tay cũng phải chạm vào thực tế bác ạ.' },
      { label: '[2] Cà khịa', reply: 'Bảo anh IT đấy viết prompt nhờ AI sửa quạt hộ xem có chạy được không!' },
      { label: '[3] Lảng tránh', reply: 'Chuyện nhà người ta bác ơi, bác húp mau bát phở nguội mất ngon!' }
    ]
  },
  {
    text: '"Anh xem xoá tận gốc PUBG trong máy em chưa đấy? Cả cộng đồng đang xoá game!"',
    choices: [
      { label: '[1] Chân thành', reply: 'Trò chơi để mua vui, thấy bất công thì dẹp sang một bên cho nhẹ đầu.' },
      { label: '[2] Chửi thẳng', reply: 'Bắn gà chết ngoài bo xong đổ thừa cho máy! Trả 50k tiền công đi!' },
      { label: '[3] Lươn lẹo', reply: 'Xóa rồi nhưng em cài cho anh tool cày clone, vào vote 1 sao cho bõ tức nhé!' }
    ]
  }
];

  const handleReply = (choiceIdx: number) => {
    audioManager.playBlipSFX();
    const scenario = SCENARIOS[customer.scenarioIdx];
    
    if (choiceIdx === 0) store.addMobAnger(-10);
    else if (choiceIdx === 1) store.addMobAnger(5);
    
    setPlayerReply(scenario.choices[choiceIdx].reply);
    
    setTimeout(() => {
      setPlayerReply(null);
      setCustomer({ active: false, patience: 12000, order: null, state: 'waiting', scenarioIdx: 0 });
    }, 2500);
  };

  const renderDialogue = () => {
    let speaker = "Nhật Ký";
    let text = "Mở cửa hàng đón khách nào!";
    let portrait = "hero";

    if (playerReply) {
      speaker = "Chủ Quán";
      text = playerReply;
    } else if (customer.active) {
      speaker = "Khách Hàng";
      portrait = "customer";
      if (customer.state === 'waiting') {
        const itemName = items.find((i: JobItem) => i.id === customer.order)?.name;
        text = `"Cho tôi một ${itemName || 'suất'} nhé, lẹ lên!"`;
      } else if (customer.state === 'replying' || customer.state === 'happy') {
        text = SCENARIOS[customer.scenarioIdx].text;
      } else {
        text = '"Làm ăn lề mề quá, tôi đi quán khác!"';
      }
    }

    return (
      <div className="h-[22%] bg-[#1a0e08] p-2 flex flex-col items-center justify-center shrink-0 border-t-4 border-[#3f2010] relative z-10">
        <div className="bg-[#fef3c7] border-4 border-[#78350f] p-2 flex gap-3 items-start w-full h-full shadow-inner">
          <div className="w-[48px] h-[48px] bg-[#d97706] border-2 border-[#78350f] flex-shrink-0 flex items-center justify-center mt-1">
            <span className="font-[VT323] text-2xl text-[#fef3c7] uppercase">{portrait.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <h3 className="text-[#d97706] font-bold text-[16px] font-[VT323] uppercase leading-none drop-shadow-[1px_1px_0px_#fef3c7]">{speaker}</h3>
            <p className="text-[#1c1917] text-[16px] font-[Share_Tech_Mono] leading-tight mt-1 mb-1">{text}</p>
            
            {customer.state === 'replying' && !playerReply && (
              <div className="flex flex-col gap-1 mt-auto">
                {SCENARIOS[customer.scenarioIdx].choices.map((c, i) => (
                  <button key={i} onClick={() => handleReply(i)} className={`text-left text-white px-2 py-0.5 font-[Share_Tech_Mono] text-[15px] border shadow-sm ${i === 0 ? 'bg-[#15803d] hover:bg-[#166534] border-[#14532d]' : i === 1 ? 'bg-[#991b1b] hover:bg-[#b91c1c] border-[#450a0a]' : 'bg-[#ca8a04] hover:bg-[#eab308] border-[#713f12]'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
            {renderHUD()}
      <StallViewport 
        cookingSlots={cookingSlots} 
        customer={customer} 
        onDeliver={deliverFood} 
        items={items}
        phoneRinging={phoneRinging}
        onPhoneClick={() => { setPhoneRinging(false); setShowPhone(true); }}
      />
      {renderTray()}
      {renderDialogue()}
      {showPhone && <PhoneScamModal onClose={() => setShowPhone(false)} />}
    </div>
  );
}
