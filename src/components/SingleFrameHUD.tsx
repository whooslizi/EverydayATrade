
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { CharacterCanvas } from './CharacterCanvas';
import { DialogueModal } from './DialogueModal';
import { formatVND, JOBS, PRICING_OPTIONS } from '../data/gameData';
import type { JobItem } from '../types';

export function SingleFrameHUD() {
  const store = useGameStore((s: any) => s);
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'PRICING' | 'DEBT' | 'LOG'>('ITEMS');

  const job = store.currentJob || JOBS[0];
  const items = job.items || [];

  const craftItem = (item: JobItem) => {
    if (store.cash < item.ingredientCost) {
      audioManager.playErrorSFX();
      return;
    }
    audioManager.playBlipSFX();
    store.buyIngredients(item.id, 1, item.ingredientCost);
    store.startCraft(item.id);
    setTimeout(() => {
      useGameStore.getState().finishCraft(item.id);
    }, item.craftTimeMs || 1000);
  };

  const increasePricing = () => {
    audioManager.playBlipSFX();
    const currIdx = PRICING_OPTIONS.findIndex(p => p.tier === store.selectedPricing);
    if (currIdx < PRICING_OPTIONS.length - 1) {
      store.setPricing(PRICING_OPTIONS[currIdx + 1].tier);
    }
  };

  const decreasePricing = () => {
    audioManager.playBlipSFX();
    const currIdx = PRICING_OPTIONS.findIndex(p => p.tier === store.selectedPricing);
    if (currIdx > 0) {
      store.setPricing(PRICING_OPTIONS[currIdx - 1].tier);
    }
  };

  const toggleSound = () => {
    audioManager.playBlipSFX();
    store.toggleSound();
  };

  const currentPricing = PRICING_OPTIONS.find(p => p.tier === store.selectedPricing)!;
  
  // Helper to count how many items we can sell
  const totalCrafted = store.inventory.reduce((acc: number, slot: any) => acc + slot.craftedQty, 0);

  // Section 1: HUD
  const renderHUD = () => (
    <div className="h-[48px] bg-[#1a0e08] border-b-4 border-[#3f2010] flex items-center justify-between px-3 shrink-0">
      <div className="font-[VT323] text-[#facc15] text-xl flex items-center gap-1">
        Ngày {store.day}/{store.maxDays}
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-[VT323] text-[#34d399] text-[18px] leading-tight drop-shadow-md">
          Ví: {formatVND(store.cash)}
        </div>
        <div className="font-[VT323] text-[#ef4444] text-[14px] leading-tight mt-[-2px]">
          Nợ: {formatVND(store.debt)}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={toggleSound} className="bg-[#3f2010] p-1 border-2 border-[#78350f]">
          {store.isSoundOn ? '🔊' : '🔇'}
        </button>
        <button onClick={() => store.setStage('TITLE')} className="bg-[#991b1b] px-2 text-white font-[VT323] border-2 border-[#450a0a]">
          THOÁT
        </button>
      </div>
    </div>
  );

  // Section 2: Canvas
  const renderCanvas = () => (
    <div className="h-[38%] relative border-b-4 border-[#3f2010] bg-[#2a1b14] overflow-hidden shrink-0">
      <CharacterCanvas customerWaiting={totalCrafted > 0} />
    </div>
  );

  // Section 3: Management Tray
  const renderTray = () => (
    <div className="h-[38%] bg-[#fef3c7] flex flex-col shrink-0 border-b-4 border-[#3f2010]">
      {/* Tabs */}
      <div className="flex bg-[#3f2010] px-2 pt-2 gap-1 h-[36px] shrink-0">
        {(['ITEMS', 'PRICING', 'DEBT', 'LOG'] as const).map(tab => {
          const labels = { ITEMS: 'NGUYÊN LIỆU', PRICING: 'ĐỊNH GIÁ', DEBT: 'SỔ NỢ', LOG: 'NHẬT KÝ' };
          const active = activeTab === tab;
          return (
            <button 
              key={tab} 
              onClick={() => { audioManager.playBlipSFX(); setActiveTab(tab); }}
              className={`flex-1 rounded-t-lg font-[VT323] text-[16px] transition-colors ${active ? 'bg-[#fef3c7] text-[#78350f]' : 'bg-[#1a0e08] text-[#fef3c7]'}`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-2 font-[Share_Tech_Mono] text-[15px] text-[#1c1917] custom-scrollbar">
        {activeTab === 'ITEMS' && (
          <div className="space-y-2">
            {items.map((item: JobItem) => {
              const slot = store.inventory.find((i: any) => i.itemId === item.id);
              const qty = slot ? slot.craftedQty : 0;
              return (
                <div key={item.id} className="flex justify-between items-center border-b-2 border-[#d4d4d8] pb-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-xl">{item.icon}</span>
                    <div className="leading-tight">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-[#78350f]">Vốn: {formatVND(item.ingredientCost)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => craftItem(item)} className="bg-[#15803d] text-white px-2 py-1 rounded font-bold hover:bg-[#166534] border border-[#14532d]">+</button>
                    <div className="w-[30px] text-center bg-white border border-[#78350f]">{qty}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'PRICING' && (
          <div className="flex flex-col h-full justify-center space-y-4">
            <div className="text-center font-bold text-lg mb-2">{currentPricing.label}</div>
            <div className="flex justify-center items-center gap-4">
              <button onClick={decreasePricing} className="bg-[#991b1b] text-white px-4 py-2 font-[VT323] text-xl border-2 border-[#450a0a]">-</button>
              <div className="text-center w-[120px]">
                <div>Biên độ x{currentPricing.marginMultiplier}</div>
                <div className="text-[#991b1b] text-sm">Giận +{currentPricing.angerIncrease}</div>
              </div>
              <button onClick={increasePricing} className="bg-[#15803d] text-white px-4 py-2 font-[VT323] text-xl border-2 border-[#14532d]">+</button>
            </div>
          </div>
        )}

        {activeTab === 'DEBT' && (
          <div className="space-y-2">
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1">
              <span>Nợ hiện tại:</span>
              <span className="text-[#991b1b] font-bold">{formatVND(store.debt)}</span>
            </div>
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1">
              <span>Nghi ngờ thuế:</span>
              <span>{store.taxSuspicion}/100</span>
            </div>
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1">
              <span>Giận của khách:</span>
              <span>{store.mobAnger}/100</span>
            </div>
            <div className="flex justify-between">
              <span>Số lần bị bắt:</span>
              <span>{store.timesArrested}</span>
            </div>
          </div>
        )}

        {activeTab === 'LOG' && (
          <div className="space-y-1">
            {store.log.length > 0 ? store.log.slice(-5).reverse().map((entry: string, i: number) => (
              <div key={i} className="text-xs border-b border-[#d4d4d8] pb-1">{entry}</div>
            )) : <div className="text-center italic mt-4">Chưa có ghi chép.</div>}
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          if (totalCrafted > 0) {
            audioManager.playCoinSFX();
            let totalRevenue = 0;
            store.inventory.forEach((slot: any) => {
              if (slot.craftedQty > 0) {
                const itemDef = items.find((i: any) => i.id === slot.itemId);
                if (itemDef) {
                  totalRevenue += slot.craftedQty * itemDef.basePrice * currentPricing.marginMultiplier;
                }
              }
            });
            store.sellBatch(totalCrafted, totalRevenue);
          } else {
            audioManager.playErrorSFX();
            setActiveTab('ITEMS');
          }
        }} 
        className="w-full h-[46px] shrink-0 bg-[#991b1b] hover:bg-[#b91c1c] text-white font-[VT323] text-2xl border-t-2 border-[#450a0a]"
      >
        {totalCrafted > 0 ? 'GIAO MÓN & TÍNH TIỀN' : 'BẮT ĐẦU CA MƯU SINH'}
      </button>
    </div>
  );

  // Section 4: Dialogue/Tutorial Box
  const renderDialogue = () => (
    <div className="flex-1 bg-[#1a0e08] p-2 flex items-center justify-center min-h-0">
      <DialogueModal 
        speakerId="hero"
        speakerName="Nhật Ký"
        text={totalCrafted > 0 ? "Có món rồi! Bấm [GIAO MÓN] để kiếm tiền." : "Bấm [+] ở NGUYÊN LIỆU để chế tạo món ăn trước nhé."}
        onComplete={() => {}}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      {renderHUD()}
      {renderCanvas()}
      {renderTray()}
      {renderDialogue()}
    </div>
  );
}
