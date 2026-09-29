import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { PRICING_OPTIONS, formatVND } from '../data/gameData';
import { audioManager } from '../audio/AudioManager';
import { BackgroundCanvas } from './BackgroundCanvas';
import { CharacterCanvas } from './CharacterCanvas';

export function WorkingPhase() {
  const store = useGameStore();
  const [craftProgress, setCraftProgress] = useState(0);
  const [customerWaiting, setCustomerWaiting] = useState(false);
  const [customerTimer, setCustomerTimer] = useState(0);
  const [shiftTime, setShiftTime] = useState(180);
  const [craftingItemId, setCraftingItemId] = useState<string | null>(null);
  
  // Effects
  const [shake, setShake] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, color: string, x: number, y: number}[]>([]);
  const floatIdRef = useRef(0);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const craftTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shiftEndedRef = useRef(false);

  const job = store.currentJob;
  if (!job) return null;

  const currentPricing = PRICING_OPTIONS.find((p) => p.tier === store.selectedPricing) || PRICING_OPTIONS[0];
  const totalCrafted = store.inventory.reduce((sum, inv) => sum + inv.craftedQty, 0);

  const spawnFloat = (text: string, color: string, x: number, y: number) => {
    const id = floatIdRef.current++;
    setFloatingTexts(prev => [...prev, { id, text, color, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setShiftTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (totalCrafted <= 0 || shiftTime <= 0) return;
    const spawnRate = 3000 / (currentPricing.salesSpeedMultiplier || 1);
    const interval = setInterval(() => {
      if (Math.random() < 0.6 && totalCrafted > 0 && !customerWaiting) {
        setCustomerWaiting(true);
        setCustomerTimer(8);
      }
    }, spawnRate);
    return () => clearInterval(interval);
  }, [totalCrafted, currentPricing.salesSpeedMultiplier, shiftTime, customerWaiting]);

  useEffect(() => {
    if (!customerWaiting) return;
    const t = setInterval(() => {
      setCustomerTimer((prev) => {
        if (prev <= 1) {
          setCustomerWaiting(false);
          spawnFloat("Khách bỏ đi!", "#ef4444", 200, 50);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [customerWaiting]);

  const startCrafting = (itemId: string) => {
    const inv = store.inventory.find((i) => i.itemId === itemId);
    if (!inv || inv.rawQty <= 0) {
      spawnFloat("Hết nguyên liệu!", "#ef4444", 200, 200);
      return;
    }
    if (store.playerEnergy <= 0) {
      spawnFloat("Hết sức!", "#ef4444", 200, 200);
      return;
    }

    store.startCraft(itemId);
    setCraftProgress(0);
    setCraftingItemId(itemId);

    const item = job.items.find((i) => i.id === itemId);
    const craftMs = item?.craftTimeMs || 2000;
    const step = 50;
    let progress = 0;
    
    audioManager.audioManager.playSizzleSFX();

    if (craftTimerRef.current) clearInterval(craftTimerRef.current);
    craftTimerRef.current = setInterval(() => {
      progress += (step / craftMs) * 100;
      setCraftProgress(Math.min(100, progress));
      if (progress >= 100) {
        if (craftTimerRef.current) clearInterval(craftTimerRef.current);
        store.finishCraft(itemId);
        setCraftProgress(0);
        setCraftingItemId(null);
        audioManager.audioManager.playBlipSFX();
        spawnFloat("+1 SP", "#22c55e", 200, 200);
      }
    }, step);
  };

  const sellToCustomer = () => {
    if (!customerWaiting) return;
    const craftedSlot = store.inventory.find((inv) => inv.craftedQty > 0);
    if (!craftedSlot) return;
    const item = job.items.find((i) => i.id === craftedSlot.itemId);
    if (!item) return;

    const price = Math.round(item.basePrice * currentPricing.marginMultiplier);
    store.sellBatch(1, price);

    const newInv = store.inventory.map((inv) =>
      inv.itemId === craftedSlot.itemId
        ? { ...inv, craftedQty: inv.craftedQty - 1 }
        : inv,
    );
    useGameStore.setState({ inventory: newInv });

    if (currentPricing.suspicionIncrease > 0) store.addSuspicion(currentPricing.suspicionIncrease);
    if (currentPricing.angerIncrease > 0) store.addMobAnger(currentPricing.angerIncrease);
    if (price < item.ingredientCost) store.markBelowCostDay();

    setCustomerWaiting(false);
    audioManager.audioManager.playCoinSFX();
    spawnFloat(`+${formatVND(price)}`, "#22c55e", 200, 100);
  };

  const endShift = () => {
    if (shiftEndedRef.current) return;
    shiftEndedRef.current = true;
    audioManager.audioManager.playBlipSFX();
    store.setStage('NIGHT_SETTLEMENT');
  };

  useEffect(() => {
    if (shiftTime <= 0 && !shiftEndedRef.current) {
      endShift();
    }
  }, [shiftTime]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className={`absolute inset-0 flex flex-col font-game bg-[#2d1b11] ${shake ? 'animate-shake' : ''}`}>
      {floatingTexts.map(t => (
        <div key={t.id} className="absolute z-50 pointer-events-none text-2xl font-pixel drop-shadow-[2px_2px_0px_#000] animate-float-up"
             style={{ left: t.x, top: t.y, color: t.color }}>
          {t.text}
        </div>
      ))}

      {/* Top 40%: Street View Canvas Simulator */}
      <div className="h-[40%] border-b-4 border-dark-brown relative overflow-hidden flex flex-col">
        <BackgroundCanvas />
        <CharacterCanvas customerWaiting={customerWaiting} />
        <div className="relative z-10 p-2 flex justify-between pointer-events-none">
           <span className="bg-[#2d2222] text-white px-3 py-1 font-pixel text-xl border-2 border-[#3e3030]">{job.name}</span>
           <span className={`bg-[#2d2222] px-3 py-1 font-pixel text-xl border-2 border-[#3e3030] ${shiftTime < 30 ? 'text-[#ef4444] animate-pixel-blink' : 'text-white'}`}>
             {formatTime(shiftTime)}
           </span>
        </div>
        
        {/* Customer simulation area */}
        <div className="flex-1 relative flex items-center justify-center pointer-events-none">
            {customerWaiting && (
                <div className="absolute right-12 bottom-8 flex flex-col items-center animate-slide-up">
                   <div className="bg-white border-2 border-[#3c2415] p-2 mb-2 rounded-sm text-base shadow-[2px_2px_0px_#000] relative max-w-[120px] text-center text-black">
                       Mua hang!<br/>({customerTimer}s)
                       <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-[#3c2415] transform rotate-45"></div>
                   </div>
                </div>
            )}
        </div>
      </div>

      {/* Bottom 60%: Workshop / Kitchen */}
      <div className="h-[60%] bg-[#1a1414] p-3 flex flex-col relative z-20">
        <div className="flex gap-2 mb-3">
          {PRICING_OPTIONS.map((opt) => (
            <button
              key={opt.tier}
              onClick={() => { store.setPricing(opt.tier); audioManager.audioManager.playBlipSFX(); }}
              className={`flex-1 p-2 font-pixel text-lg transition-all border-2 ${
                store.selectedPricing === opt.tier
                  ? 'bg-[#d4a637] text-[#3c2415] border-[#fdf6e2] shadow-[2px_2px_0px_#000]'
                  : 'bg-[#2d2222] text-[#fdf6e2]/70 border-[#3c2415]/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {job.items.map((item) => {
            const inv = store.inventory.find((i) => i.itemId === item.id);
            const rawQty = inv?.rawQty || 0;
            const craftedQty = inv?.craftedQty || 0;

            return (
              <div key={item.id} className="bg-[#fdf6e2] border-4 border-[#3c2415] p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col">
                <div className="flex justify-between items-center mb-2">
                   <div className="font-pixel text-xl text-[#3c2415] truncate max-w-[60%]">{item.name}</div>
                   <div className="text-base font-bold text-[#7f1d1d]">Von: {formatVND(item.ingredientCost)}</div>
                </div>
                
                <div className="flex gap-2 mb-2 items-center text-lg">
                   <div className="flex-1 bg-[#fef3c7] p-2 border-2 border-[#3c2415]/50 text-center text-[#3c2415]">
                     NL: {rawQty}
                   </div>
                   <div className="flex-1 bg-[#dcfce7] p-2 border-2 border-[#3c2415]/50 text-center text-[#3c2415]">
                     TP: {craftedQty}
                   </div>
                </div>

                {craftProgress > 0 && craftingItemId === item.id && (
                  <div className="h-4 w-full bg-[#2d2222] border-2 border-black mb-2">
                    <div className="h-full bg-[#22c55e] transition-all" style={{ width: `${craftProgress}%` }}></div>
                  </div>
                )}

                <div className="flex gap-2">
                   <button
                     onClick={() => { store.buyIngredients(item.id, 1, item.ingredientCost); audioManager.audioManager.playCoinSFX(); spawnFloat(`-${formatVND(item.ingredientCost)}`, "#ef4444", 100, 200); }}
                     disabled={store.cash < item.ingredientCost}
                     className="flex-1 bg-[#facc15] text-[#3c2415] font-pixel text-xl py-2 border-2 border-[#3c2415] shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none disabled:opacity-50"
                   >
                     MUA NL
                   </button>
                   <button
                     onClick={() => startCrafting(item.id)}
                     disabled={rawQty <= 0 || (craftingItemId !== null) || store.playerEnergy <= 0}
                     className="flex-1 bg-[#16a34a] text-[#fdf6e2] font-pixel text-xl py-2 border-2 border-[#3c2415] shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none disabled:opacity-50"
                   >
                     CHE TAO
                   </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 mt-auto">
          <button
            onClick={sellToCustomer}
            disabled={!customerWaiting || totalCrafted <= 0}
            className={`w-full font-pixel text-2xl py-4 border-4 shadow-[4px_4px_0px_#000] transition-all ${
               customerWaiting && totalCrafted > 0 
               ? 'bg-[#2563eb] text-white border-[#1e3a8a] active:translate-y-1 active:shadow-none animate-pulse'
               : 'bg-[#374151] text-[#9ca3af] border-[#111827] opacity-60'
            }`}
          >
            GIAO MON & TINH TIEN
          </button>
        </div>
      </div>
    </div>
  );
}
