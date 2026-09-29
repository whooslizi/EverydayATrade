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
          <p className="text-dark-brown/40 text-[8px] font-pixel mb-2">
            Giọng Ông Đào vọng về trong đêm...
          </p>
          <p className="text-dark-brown text-[11px] leading-relaxed font-game italic mb-4">
            {nightVoice}
          </p>
          <button
            onClick={() => {
              store.setNightVoiceShown(true);
              setShowNightVoice(false);
            }}
            className="pixel-btn text-[9px] px-4 py-2"
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
        <span className="font-pixel text-dark-brown text-xs tracking-wider">
          ️ SÁNG NGÀY {store.day}
        </span>
        {store.isFugitive && (
          <div className="text-[8px] text-red-700 font-pixel animate-pixel-blink mt-1">
            ️ Nhớ đeo khẩu trang — bạn đang bị truy nã!
          </div>
        )}
      </div>

      {/* Tab switch */}
      <div className="flex px-2 gap-1 mb-2">
        <button
          onClick={() => setTab('summary')}
          className={`flex-1 text-[9px] py-1 font-pixel border-2 border-dark-brown rounded-sm ${
            tab === 'summary' ? 'bg-parchment text-dark-brown' : 'bg-dark-brown/20 text-dark-brown/60'
          }`}
        >
           Tình hình
        </button>
        <button
          onClick={() => setTab('food')}
          className={`flex-1 text-[9px] py-1 font-pixel border-2 border-dark-brown rounded-sm ${
            tab === 'food' ? 'bg-parchment text-dark-brown' : 'bg-dark-brown/20 text-dark-brown/60'
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
            <div className="parchment-card">
              <div className="text-[10px] font-pixel text-dark-brown mb-2"> Báo Cáo Sáng</div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-game text-dark-brown/80">
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
            <div className="parchment-card">
              <div className="text-[10px] font-pixel text-dark-brown mb-1">
                 Dũng {store.dog.isKidnapped ? '(BỊ BẮT CÓC!)' : ''}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-game text-dark-brown/80">
                <div> Bụng Dũng:</div>
                <div className="text-right">{store.dog.hunger}%</div>
                <div>️ Trung thành:</div>
                <div className="text-right">{store.dog.loyalty}%</div>
              </div>
              {store.dog.hunger < 30 && (
                <p className="text-[8px] text-red-accent mt-1 font-game italic">
                  ️ Dũng đang đói lả... nhớ cho ăn kẻo nó bỏ đi!
                </p>
              )}
              {store.dog.isKidnapped && (
                <button
                  onClick={() => {
                    store.ransomDog();
                    if (store.isSoundOn) audioManager.playCoinSFX();
                  }}
                  className="pixel-btn-red text-[8px] px-3 py-1 mt-1 w-full"
                >
                   Chuộc Dũng (30.000đ)
                </button>
              )}
            </div>

            {/* Warnings */}
            {store.taxSuspicion > 50 && (
              <div className="parchment-card border-red-accent">
                <p className="text-[9px] text-red-accent font-pixel">
                   Thuế vụ đang theo dõi! ({store.taxSuspicion}%)
                </p>
              </div>
            )}
            {store.mobAnger > 50 && (
              <div className="parchment-card border-red-accent">
                <p className="text-[9px] text-red-accent font-pixel">
                   Dân phố đang giận! ({store.mobAnger}%)
                </p>
              </div>
            )}

            {/* Log */}
            {store.log.length > 0 && (
              <div className="parchment-card max-h-[100px] overflow-y-auto">
                <div className="text-[9px] font-pixel text-dark-brown mb-1"> Nhật ký</div>
                {store.log.map((entry, i) => (
                  <p key={i} className="text-[8px] text-dark-brown/70 font-game">{entry}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[9px] text-dark-brown/70 font-game text-center mb-1">
              Ăn sáng để lấy sức đi bươn chải! 
            </p>
            {FOOD_ITEMS.map((food) => (
              <div key={food.id} className="item-card">
                <span className="text-lg">{food.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-pixel text-dark-brown truncate">{food.name}</div>
                  <div className="text-[8px] text-dark-brown/60 font-game">
                    {food.forDog ? ` Dũng +${food.hungerRestore}` : `+${food.hungerRestore} +${food.energyRestore}`}
                  </div>
                </div>
                <button
                  onClick={() => {
                    store.buyFood(food.cost, food.hungerRestore, food.energyRestore, !!food.forDog, food.name);
                    if (store.isSoundOn) audioManager.playCoinSFX();
                  }}
                  disabled={store.cash < food.cost}
                  className="pixel-btn text-[8px] px-2 py-1 shrink-0 disabled:opacity-40"
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
            className="pixel-btn-red text-[9px] px-3 py-1.5 w-full mb-1"
          >
             Trả nợ Cụ Bá (giữ lại 50k vốn)
          </button>
        )}
        <button
          onClick={handleProceed}
          className="pixel-btn-gold text-[10px] px-4 py-2.5 w-full tracking-wide"
        >
          {ending ? ' Xem kết cục...' : ' Bốc Vé Đi Làm'}
        </button>
      </div>
    </div>
  );
}
