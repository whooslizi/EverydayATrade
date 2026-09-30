import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'd';
}

export function GameHUD() {
  const day = useGameStore(s => s.day);
  const maxDays = useGameStore(s => s.maxDays);
  const cash = useGameStore(s => s.cash);
  const debt = useGameStore(s => s.debt);
  const energy = useGameStore(s => s.playerEnergy);
  const hunger = useGameStore(s => s.playerHunger);
  const dog = useGameStore(s => s.dog);

  return (
    <div className="pixel-panel-dark border-x-0 border-t-0 p-2 flex flex-col gap-1.5 z-40 relative">
      {/* Row 1: Day + Cash + Debt */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-[VT323] text-lg text-[#fbc02d] pixel-text-shadow">
          Ngay {day}/{maxDays}
        </span>
        <span className="font-[VT323] text-lg text-[#10b981] pixel-text-shadow">
          {formatVND(cash)}
        </span>
        <span className="font-[VT323] text-base text-[#ef4444] pixel-text-shadow">
          No: {formatVND(debt)}
        </span>
      </div>

      {/* Row 2: Gauges */}
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex justify-between font-[VT323] text-sm">
            <span>Suc</span><span>{energy}</span>
          </div>
          <div className="retro-gauge"><div className="retro-gauge-fill bg-blue-500" style={{width:`${energy}%`}} /></div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between font-[VT323] text-sm">
            <span>No</span><span>{hunger}</span>
          </div>
          <div className="retro-gauge"><div className="retro-gauge-fill bg-green-500" style={{width:`${hunger}%`}} /></div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between font-[VT323] text-sm">
            <span>Dung</span><span>{dog.hunger}</span>
          </div>
          <div className="retro-gauge"><div className="retro-gauge-fill bg-yellow-500" style={{width:`${dog.hunger}%`}} /></div>
        </div>
      </div>
    </div>
  );
}
