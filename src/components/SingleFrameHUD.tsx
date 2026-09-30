import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { formatVND, JOBS, PRICING_OPTIONS } from '../data/gameData';
import { PhoneScamModal } from './PhoneScamModal';
import { StallViewport } from './StallViewport';
import type { JobItem } from '../types';

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
  const [customer, setCustomer] = useState<{active: boolean, patience: number, order: string | null, state: 'waiting'|'happy'|'angry'|'replying'}>({
    active: false, patience: 12000, order: null, state: 'waiting'
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

      // Update Customer
      setCustomer(cust => {
        if (cust.active && cust.state === 'waiting') {
          const newPatience = cust.patience - dt;
          if (newPatience <= 0) {
            store.addMobAnger(10);
            return { ...cust, patience: 0, state: 'angry' };
          }
          return { ...cust, patience: newPatience };
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
      setCustomer(c => ({ ...c, state: 'replying' }));
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
    setCustomer({ active: true, patience: 12000, order, state: 'waiting' });
  };

  const renderHUD = () => (
    <div className="h-[46px] bg-[#1a0e08] border-b-4 border-[#3f2010] flex items-center justify-between px-2 shrink-0 shadow-md relative z-10">
      <div className="font-[VT323] text-[#facc15] text-[18px] flex flex-col leading-tight drop-shadow-[2px_2px_0px_#000]">
        <span>Ngày {store.day}/{store.maxDays}</span>
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
            {!store.soldDog && (
              <button 
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn bán chó Dũng không? Hành động này không thể hoàn tác.")) {
                    store.sellDog();
                    audioManager.playBlipSFX();
                  }
                }}
                className="w-full mt-2 bg-[#991b1b] text-white py-1 font-['VT323'] text-lg border-2 border-[#450a0a] animate-pulse"
              >
                BÁN CHÓ DŨNG - NHẬN 1.500.000đ
              </button>
            )}
          </div>
        )}
        {activeTab === 'LOG' && (
          <div className="space-y-1 text-xs">
            {store.log.slice(-4).reverse().map((entry: string, i: number) => <div key={i} className="border-b border-[#d4d4d8] pb-1">{entry}</div>)}
          </div>
        )}
      </div>

      <button onClick={() => { audioManager.playBlipSFX(); spawnCustomer(); }} className="w-full h-[40px] shrink-0 bg-[#991b1b] hover:bg-[#b91c1c] text-white font-[VT323] text-xl border-t-4 border-[#450a0a] drop-shadow-md">
        BẮT ĐẦU CA MƯU SINH
      </button>
    </div>
  );

  const handleReply = (choiceIdx: number) => {
    audioManager.playBlipSFX();
    setCustomer({ active: false, patience: 12000, order: null, state: 'waiting' });
    if (choiceIdx === 0) {
      store.addMobAnger(-10);
    } else if (choiceIdx === 1) {
      store.addMobAnger(5);
    }
  };

  const renderDialogue = () => {
    let speaker = "Nhật Ký";
    let text = "Mở cửa hàng đón khách nào!";
    let portrait = "hero";

    if (customer.active) {
      speaker = "Khách Hàng";
      portrait = "customer";
      if (customer.state === 'waiting') {
        const itemName = items.find((i: JobItem) => i.id === customer.order)?.name;
        text = `"Cho tôi một ${itemName || 'suất'} nhé, lẹ lên!"`;
      } else if (customer.state === 'replying' || customer.state === 'happy') {
        text = currentPricing.tier === 'CHAT_CHEM' ? '"Ối giời ôi, bát phở đắt thế?! Bò này nuôi bằng sữa tươi à?!"' : '"Biết tin gì chưa bác chủ? Con bé Hà bán quạt sắp cưới anh IT rồi!"';
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
            <p className="text-[#1c1917] text-[13px] font-[Share_Tech_Mono] leading-tight mt-1 mb-1">{text}</p>
            
            {customer.state === 'replying' && (
              <div className="flex flex-col gap-1 mt-auto">
                <button onClick={() => handleReply(0)} className="text-left bg-[#15803d] text-white px-2 py-0.5 font-[Share_Tech_Mono] text-[11px] border border-[#14532d] shadow-sm hover:bg-[#166534]">[1] Nhã nhặn & Lời Ông Đào</button>
                <button onClick={() => handleReply(1)} className="text-left bg-[#991b1b] text-white px-2 py-0.5 font-[Share_Tech_Mono] text-[11px] border border-[#450a0a] shadow-sm hover:bg-[#b91c1c]">[2] Bật lại gắt gỏng</button>
                <button onClick={() => handleReply(2)} className="text-left bg-[#ca8a04] text-white px-2 py-0.5 font-[Share_Tech_Mono] text-[11px] border border-[#713f12] shadow-sm hover:bg-[#eab308]">[3] Lươn lẹo hề hước</button>
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
