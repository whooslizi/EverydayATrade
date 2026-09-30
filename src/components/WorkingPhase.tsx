import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { PRICING_OPTIONS } from '../data/gameData';
import { CharacterCanvas } from './CharacterCanvas';

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'd';
}

type Tab = 'NGUYEN_LIEU' | 'DINH_GIA' | 'SO_NO' | 'NHAT_KY';

export function WorkingPhase() {
  const store = useGameStore();
  const job = store.currentJob;
  const [activeTab, setActiveTab] = useState<Tab>('NGUYEN_LIEU');
  const [craftingItemId, setCraftingItemId] = useState<string | null>(null);
  const [craftProgress, setCraftProgress] = useState(0);
  const [customerWaiting, setCustomerWaiting] = useState(false);
  const [floats, setFloats] = useState<{ id: number; text: string; color: string; x: number; y: number }[]>([]);
  const floatId = useRef(0);

  const spawnFloat = useCallback((text: string, color: string) => {
    const id = floatId.current++;
    setFloats(prev => [...prev, { id, text, color, x: 180 + Math.random() * 80, y: 40 }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1200);
  }, []);

  // Customer arrival timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!customerWaiting && Math.random() > 0.5) {
        setCustomerWaiting(true);
        audioManager.playBlipSFX();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [customerWaiting]);

  // Crafting timer
  useEffect(() => {
    if (!craftingItemId) return;
    setCraftProgress(0);
    const interval = setInterval(() => {
      setCraftProgress(prev => {
        if (prev >= 100) {
          store.finishCraft(craftingItemId);
          setCraftingItemId(null);
          audioManager.playSizzleSFX();
          spawnFloat('+1', '#10b981');
          return 0;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [craftingItemId]);

  if (!job) return null;

  const totalCrafted = store.inventory.reduce((s, i) => s + i.craftedQty, 0);
  const pricing = PRICING_OPTIONS.find(p => p.tier === store.selectedPricing) || PRICING_OPTIONS[0];

  const sellToCustomer = () => {
    if (!customerWaiting || totalCrafted <= 0) return;
    const item = job.items[0];
    const price = Math.round(item.basePrice * pricing.marginMultiplier);
    const revenue = price * totalCrafted;
    store.sellBatch(totalCrafted, revenue);
    store.addSuspicion(pricing.suspicionIncrease);
    store.addMobAnger(pricing.angerIncrease);
    store.depleteEnergy(10);
    audioManager.playRegisterSFX();
    spawnFloat('+' + formatVND(revenue), '#10b981');
    setCustomerWaiting(false);
    // Clear crafted inventory
    store.inventory.forEach(inv => {
      if (inv.craftedQty > 0) {
        for (let i = 0; i < inv.craftedQty; i++) store.finishCraft(inv.itemId);
      }
    });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'NGUYEN_LIEU', label: 'NGUYÊN LIỆU' },
    { id: 'DINH_GIA', label: 'ĐỊNH GIÁ' },
    { id: 'SO_NO', label: 'SỔ NỢ' },
    { id: 'NHAT_KY', label: 'NHẬT KÝ' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-[#231812]">
      {/* Top: Canvas (42%) */}
      <div className="h-[42%] relative bg-[#1e1e24] border-b-4 border-[#78471c] overflow-hidden">
        <CharacterCanvas customerWaiting={customerWaiting} />
        {/* Floating text */}
        {floats.map(f => (
          <div key={f.id} className="absolute font-[VT323] text-xl pixel-text-shadow animate-fade-in pointer-events-none"
            style={{ color: f.color, left: f.x, top: f.y, animation: 'slide-up 1s ease-out forwards' }}
          >{f.text}</div>
        ))}

        {/* Job title badge */}
        <div className="absolute top-2 left-2 bg-[#231812]/90 border-2 border-[#78471c] px-2 py-0.5">
          <span className="font-[VT323] text-base text-[#fbc02d]">{job.name}</span>
        </div>
      </div>

      {/* Bottom: Tabs (58%) */}
      <div className="h-[58%] flex flex-col">
        {/* Tab bar */}
        <div className="flex border-b-3 border-[#78471c]">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); audioManager.playTabSFX(); }}
              className={`flex-1 py-2 font-[VT323] text-base text-center border-r border-[#78471c] last:border-r-0 transition-colors min-h-[44px] ${
                activeTab === t.id ? 'bg-[#f4ecd8] text-[#3e2723]' : 'bg-[#231812] text-[#78716c] hover:bg-[#3c2415]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
          {activeTab === 'NGUYEN_LIEU' && (
            <div className="space-y-2">
              {job.items.map(item => {
                const inv = store.inventory.find(i => i.itemId === item.id);
                const rawQty = inv?.rawQty || 0;
                const craftedQty = inv?.craftedQty || 0;
                return (
                  <div key={item.id} className="pixel-panel p-2">
                    <div className="flex justify-between font-[VT323] text-lg text-[#3e2723]">
                      <span>{item.name}</span>
                      <span className="text-[#78350f]">Vốn: {formatVND(item.ingredientCost)}</span>
                    </div>
                    <div className="flex gap-2 font-[Roboto_Mono] text-sm text-[#78716c] my-1">
                      <span>NL: {rawQty}</span>
                      <span>TP: {craftedQty}</span>
                    </div>
                    {craftingItemId === item.id && (
                      <div className="retro-gauge mb-2"><div className="retro-gauge-fill bg-green-500" style={{width:`${craftProgress}%`}} /></div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { store.buyIngredients(item.id, 1, item.ingredientCost); audioManager.playGearSFX(); spawnFloat('-' + formatVND(item.ingredientCost), '#ef4444'); }}
                        disabled={store.cash < item.ingredientCost}
                        className="pixel-btn pixel-btn-gold flex-1 font-[VT323] text-lg"
                      >MUA NL</button>
                      <button
                        onClick={() => { if (rawQty > 0 && !craftingItemId) { store.startCraft(item.id); setCraftingItemId(item.id); } }}
                        disabled={rawQty <= 0 || craftingItemId !== null || store.playerEnergy <= 0}
                        className="pixel-btn pixel-btn-green flex-1 font-[VT323] text-lg"
                      >CHẾ TẠO</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'DINH_GIA' && (
            <div className="space-y-2">
              {PRICING_OPTIONS.map(p => (
                <button
                  key={p.tier}
                  onClick={() => { store.setPricing(p.tier); audioManager.playBlipSFX(); }}
                  className={`pixel-panel w-full p-3 text-left cursor-pointer ${
                    store.selectedPricing === p.tier ? 'border-[#fbc02d] border-4' : ''
                  }`}
                >
                  <h3 className="font-[VT323] text-xl text-[#3e2723]">{p.label}</h3>
                  <p className="font-[Roboto_Mono] text-sm text-[#78716c]">
                    Lãi x{p.marginMultiplier} | Nghi ngờ +{p.suspicionIncrease}% | Giận +{p.angerIncrease}%
                  </p>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'SO_NO' && (
            <div className="pixel-panel p-3">
              <table className="w-full font-[Roboto_Mono] text-sm text-[#3e2723]">
                <tbody>
                  <tr><td>Nợ hiện tại:</td><td className="text-right font-bold text-[#d32f2f]">{formatVND(store.debt)}</td></tr>
                  <tr><td>Lãi/ngày:</td><td className="text-right">-{formatVND(store.dailyInterest)}</td></tr>
                  <tr><td>Nghi ngờ thuế:</td><td className="text-right">{store.taxSuspicion}%</td></tr>
                  <tr><td>Giận của mob:</td><td className="text-right">{store.mobAnger}%</td></tr>
                  <tr><td>Số lần bị bắt:</td><td className="text-right">{store.timesArrested}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'NHAT_KY' && (
            <div className="pixel-panel p-3 font-[Roboto_Mono] text-sm text-[#3e2723] space-y-1">
              {store.log.length === 0 && <p className="text-[#78716c] italic">Chưa có ghi chép.</p>}
              {store.log.slice(-15).map((entry, i) => (
                <p key={i}>{entry}</p>
              ))}
            </div>
          )}
        </div>

        {/* Bottom action: Sell */}
        <div className="p-3 border-t-4 border-[#78471c]">
          <button
            onClick={sellToCustomer}
            disabled={!customerWaiting || totalCrafted <= 0}
            className={`pixel-btn w-full font-[VT323] text-2xl py-3 ${
              customerWaiting && totalCrafted > 0 ? 'pixel-btn-red animate-pulse' : 'pixel-btn-gray'
            }`}
          >
            GIAO MÓN & TÍNH TIỀN
          </button>
        </div>
      </div>
    </div>
  );
}
