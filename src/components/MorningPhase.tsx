// ====== MORNING PHASE ======
import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { FOOD_ITEMS, formatVND, NIGHT_VOICES, rollRandomEvent, shouldTriggerEnding } from '../data/gameData';
import { audioManager } from '../audio/AudioManager';;

export function MorningPhase() {
  const store = useGameStore();
  const [tab, setTab] = useState<'summary' | 'food'>('summary');
  const [showNightVoice, setShowNightVoice] = useState(!store.nightVoiceShown && store.day > 1);

  const voiceIndex = (store.day - 1) % NIGHT_VOICES.length;
  const nightVoice = NIGHT_VOICES[voiceIndex];

  // Check endings at morning
  const ending = shouldTriggerEnding(store);

  const handleProceed = () => {
    if (store.isSoundOn) audioManager.playBlipSFX();
    if (ending) {
      store.triggerEnding(ending);
      return;
    }
    store.setStage('JOB_SELECT');
  };

  if (showNightVoice) {
    return (
      <div className="absolute inset-0 night-gradient flex items-center justify-center p-4">
        <div className="dialog-box max-w-[330px] w-full animate-slide-up text-center">
          <div className="text-2xl mb-3"></div>
          <p className="text-[#e8dcdc]/40 text-sm font-pixel mb-2">
            Giọng Ông Đào vọng về trong đêm...
          </p>
          <p className="text-[#e8dcdc] text-base leading-relaxed font-game italic mb-4">
            {nightVoice}
          </p>
          <button
            onClick={() => {
              store.setNightVoiceShown(true);
              setShowNightVoice(false);
            }}
            className="bg-[#2d2222] text-[#fdf6e2] font-bold py-3 px-4 rounded-[12px] border-2 border-[#3e3030] hover:bg-[#3e3030] transition-all text-[9px] px-4 py-2"
          >
            ... (Sáng rồi, dậy thôi)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #fde68a 0%, #fbbf24 20%, #f59e0b 50%, #d97706 80%, #92400e 100%)',
      }}
    >
      {/* Header */}
      <div className="text-center py-2">
        <span className="font-pixel text-[#e8dcdc] text-base tracking-wider">
          ️ SÁNG NGÀY {store.day}
        </span>
        {store.isFugitive && (
          <div className="text-sm text-red-700 font-pixel animate-pixel-blink mt-1">
            ️ Nhớ đeo khẩu trang — bạn đang bị truy nã!
          </div>
        )}
      </div>

      {/* Tab switch */}
      <div className="flex px-2 gap-1 mb-2">
        <button
          onClick={() => setTab('summary')}
          className={`flex-1 text-[9px] py-1 font-pixel border-2 border-[#3e3030] rounded-sm ${
            tab === 'summary' ? 'bg-parchment text-[#e8dcdc]' : 'bg-dark-brown/20 text-[#e8dcdc]/60'
          }`}
        >
           Tình hình
        </button>
        <button
          onClick={() => setTab('food')}
          className={`flex-1 text-[9px] py-1 font-pixel border-2 border-[#3e3030] rounded-sm ${
            tab === 'food' ? 'bg-parchment text-[#e8dcdc]' : 'bg-dark-brown/20 text-[#e8dcdc]/60'
          }`}
        >
           Ăn uống
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {tab === 'summary' ? (
          <div className="space-y-2">
            {/* Daily report */}
            <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg">
              <div className="text-sm font-pixel text-[#e8dcdc] mb-2"> Báo Cáo Sáng</div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-game text-[#e8dcdc]/80">
                <div> Tiền mặt:</div>
                <div className="text-right font-bold">{formatVND(store.cash)}</div>
                <div> Nợ còn:</div>
                <div className="text-right font-bold text-red-accent">{formatVND(store.debt)}</div>
                <div> Lãi/ngày:</div>
                <div className="text-right text-red-accent">+{formatVND(store.dailyInterest)}</div>
                <div> Bụng:</div>
                <div className="text-right">{store.playerHunger}%</div>
                <div> Thể lực:</div>
                <div className="text-right">{store.playerEnergy}%</div>
              </div>
            </div>

            {/* Dog status */}
            <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg">
              <div className="text-sm font-pixel text-[#e8dcdc] mb-1">
                 Dũng {store.dog.isKidnapped ? '(BỊ BẮT CÓC!)' : ''}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-game text-[#e8dcdc]/80">
                <div> Bụng Dũng:</div>
                <div className="text-right">{store.dog.hunger}%</div>
                <div>️ Trung thành:</div>
                <div className="text-right">{store.dog.loyalty}%</div>
              </div>
              {store.dog.hunger < 30 && (
                <p className="text-sm text-red-accent mt-1 font-game italic">
                  ️ Dũng đang đói lả... nhớ cho ăn kẻo nó bỏ đi!
                </p>
              )}
              {store.dog.isKidnapped && (
                <button
                  onClick={() => {
                    store.ransomDog();
                    if (store.isSoundOn) audioManager.playCoinSFX();
                  }}
                  className="bg-[#ff6b6b] text-white font-bold py-3 px-4 rounded-[12px] shadow-[0_4px_0_#c92a2a] hover:bg-[#fa5252] active:translate-y-1 active:shadow-none transition-all w-full text-sm px-3 py-1 mt-1 w-full"
                >
                   Chuộc Dũng (30.000đ)
                </button>
              )}
            </div>

            {/* Warnings */}
            {store.taxSuspicion > 50 && (
              <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg border-red-accent">
                <p className="text-[9px] text-red-accent font-pixel">
                   Thuế vụ đang theo dõi! ({store.taxSuspicion}%)
                </p>
              </div>
            )}
            {store.mobAnger > 50 && (
              <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg border-red-accent">
                <p className="text-[9px] text-red-accent font-pixel">
                   Dân phố đang giận! ({store.mobAnger}%)
                </p>
              </div>
            )}

            {/* Log */}
            {store.log.length > 0 && (
              <div className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg max-h-[100px] overflow-y-auto">
                <div className="text-[9px] font-pixel text-[#e8dcdc] mb-1"> Nhật ký</div>
                {store.log.map((entry, i) => (
                  <p key={i} className="text-sm text-[#e8dcdc]/70 font-game">{entry}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[9px] text-[#e8dcdc]/70 font-game text-center mb-1">
              Ăn sáng để lấy sức đi bươn chải! 
            </p>
            {FOOD_ITEMS.map((food) => (
              <div key={food.id} className="item-card">
                <span className="text-lg">{food.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-pixel text-[#e8dcdc] truncate">{food.name}</div>
                  <div className="text-sm text-[#e8dcdc]/60 font-game">
                    {food.forDog ? ` Dũng +${food.hungerRestore}` : `+${food.hungerRestore} +${food.energyRestore}`}
                  </div>
                </div>
                <button
                  onClick={() => {
                    store.buyFood(food.cost, food.hungerRestore, food.energyRestore, !!food.forDog, food.name);
                    if (store.isSoundOn) audioManager.playCoinSFX();
                  }}
                  disabled={store.cash < food.cost}
                  className="bg-[#2d2222] text-[#fdf6e2] font-bold py-3 px-4 rounded-[12px] border-2 border-[#3e3030] hover:bg-[#3e3030] transition-all text-sm px-2 py-1 shrink-0 disabled:opacity-40"
                >
                  {formatVND(food.cost)}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proceed button */}
      <div className="px-2 pb-2">
        {/* Pay debt shortcut */}
        {store.cash >= 100000 && store.debt > 0 && (
          <button
            onClick={() => {
              const amount = Math.min(store.cash - 50000, store.debt);
              if (amount > 0) {
                store.payDebt(amount);
                if (store.isSoundOn) audioManager.playCoinSFX();
              }
            }}
            className="bg-[#ff6b6b] text-white font-bold py-3 px-4 rounded-[12px] shadow-[0_4px_0_#c92a2a] hover:bg-[#fa5252] active:translate-y-1 active:shadow-none transition-all w-full text-[9px] px-3 py-1.5 w-full mb-1"
          >
             Trả nợ Cụ Bá (giữ lại 50k vốn)
          </button>
        )}
        <button
          onClick={handleProceed}
          className="bg-[#fcc419] text-[#1a1414] font-bold py-3 px-4 rounded-[12px] shadow-[0_4px_0_#e67700] hover:bg-[#fab005] active:translate-y-1 active:shadow-none transition-all w-full text-sm px-4 py-2.5 w-full tracking-wide"
        >
          {ending ? ' Xem kết cục...' : ' Bốc Vé Đi Làm'}
        </button>
      </div>
    </div>
  );
}
