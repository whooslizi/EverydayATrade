import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { FOOD_ITEMS } from '../data/gameData';

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'd';
}

export function MorningPhase() {
  const store = useGameStore();

  const handleFeed = (item: typeof FOOD_ITEMS[0]) => {
    if (store.cash < item.cost) {
      audioManager.playErrorSFX();
      return;
    }
    audioManager.playCoinSFX();
    store.buyFood(item.cost, item.hungerRestore, item.energyRestore, !!item.forDog, item.name);
  };

  const handlePayDebt = () => {
    const amt = Math.min(store.cash, 100000);
    if (amt <= 0) { audioManager.playErrorSFX(); return; }
    audioManager.playCoinSFX();
    store.payDebt(amt);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#231812] overflow-y-auto custom-scrollbar">
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h2 className="font-[VT323] text-2xl text-[#fbc02d] pixel-text-shadow uppercase text-center">
          SÁNG NGÀY {store.day}
        </h2>

        {/* Player food */}
        <div className="pixel-panel p-3">
          <h3 className="font-[VT323] text-lg text-[#3e2723] mb-2 uppercase">Báo Cái Bang</h3>
          <table className="w-full font-[Roboto_Mono] text-sm text-[#3e2723]">
            <tbody>
              <tr><td>Tiền mặt:</td><td className="text-right font-bold">{formatVND(store.cash)}</td></tr>
              <tr><td>Nợ còn:</td><td className="text-right text-[#d32f2f]">{formatVND(store.debt)}</td></tr>
              <tr><td>Lãi/ngày:</td><td className="text-right text-[#991b1b]">-{formatVND(store.dailyInterest)}</td></tr>
              <tr><td>Sức:</td><td className="text-right">{store.playerEnergy}%</td></tr>
              <tr><td>Do no:</td><td className="text-right">{store.playerHunger}%</td></tr>
            </tbody>
          </table>
        </div>

        {/* Dog status */}
        <div className="pixel-panel p-3">
          <h3 className="font-[VT323] text-lg text-[#3e2723] mb-2 uppercase">Dũng</h3>
          <table className="w-full font-[Roboto_Mono] text-sm text-[#3e2723] mb-3">
            <tbody>
              <tr><td>Độ no Dũng:</td><td className="text-right">{store.dog.hunger}%</td></tr>
              <tr><td>Trung thành:</td><td className="text-right">{store.dog.loyalty}%</td></tr>
            </tbody>
          </table>
          {!store.soldDog && (
            <button
              onClick={() => {
                if (window.confirm("Bán Dũng để lấy 363.636đ? Sẽ không thể quay lại!")) {
                  audioManager.playBlipSFX();
                  store.sellDog();
                }
              }}
              className="pixel-btn pixel-btn-red w-full font-[VT323] text-lg"
            >
              BÁN DŨNG (363.636đ)
            </button>
          )}
        </div>

        {/* Food items */}
        <div className="pixel-panel p-3">
          <h3 className="font-[VT323] text-lg text-[#3e2723] mb-2 uppercase">Mua Đồ Ăn</h3>
          <div className="space-y-2">
            {FOOD_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleFeed(item)}
                disabled={store.cash < item.cost}
                className="pixel-btn pixel-btn-gold w-full text-left font-[Roboto_Mono] text-sm flex justify-between"
              >
                <span>{item.name} {item.forDog ? '(cho Dũng)' : ''}</span>
                <span>{formatVND(item.cost)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Debt Payment */}
        <button
          onClick={handlePayDebt}
          disabled={store.cash <= 0}
          className="pixel-btn pixel-btn-red w-full font-[VT323] text-lg"
        >
          TRẢ NỢ (100k hoặc tối đa)
        </button>
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 p-3 bg-[#231812] border-t-4 border-[#78471c]">
        <button
          onClick={() => { audioManager.playBlipSFX(); store.setStage('JOB_SELECT'); }}
          className="pixel-btn pixel-btn-green w-full font-[VT323] text-2xl py-3"
        >
          BẮT ĐẦU CA
        </button>
      </div>
    </div>
  );
}
