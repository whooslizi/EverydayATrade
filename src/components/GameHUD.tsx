import { useGameStore } from '../store/useGameStore';

function MeterBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-pixel text-parchment/80 w-12 shrink-0 truncate">{label}</span>
      <div className="h-4 flex-1 border-2 border-dark-brown overflow-hidden bg-[#2a1a0a]">
        <div className="h-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-pixel text-parchment/80 w-8 text-right">{Math.round(value)}</span>
    </div>
  );
}

export function GameHUD() {
  const day = useGameStore((s) => s.day);
  const maxDays = useGameStore((s) => s.maxDays);
  const cash = useGameStore((s) => s.cash);
  const debt = useGameStore((s) => s.debt);
  const playerHunger = useGameStore((s) => s.playerHunger);
  const playerEnergy = useGameStore((s) => s.playerEnergy);
  const dog = useGameStore((s) => s.dog);
  const taxSuspicion = useGameStore((s) => s.taxSuspicion);
  const mobAnger = useGameStore((s) => s.mobAnger);

  return (
    <div className="bg-[#1a120b]/95 px-3 py-3 border-b-4 border-gold-accent/40 shrink-0 select-none z-40 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-br from-[#d4a637] to-[#f0c850] text-[#3c2415] border-2 border-[#8a6d1b] shadow-[2px_2px_0px_#000] text-base font-pixel">
            Ngày {day}/{maxDays}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-br from-[#d4a637] to-[#f0c850] text-[#3c2415] border-2 border-[#8a6d1b] shadow-[2px_2px_0px_#000] text-base font-pixel">
          {cash.toLocaleString('vi-VN')} đ
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-br from-[#a83232] to-[#cc4444] text-[#fdf6e2] border-2 border-[#5a1010] shadow-[2px_2px_0px_#000] text-base font-pixel">
          Nợ: {debt.toLocaleString('vi-VN')} đ
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <MeterBar value={playerHunger} max={100} color="#f59e0b" label="Bụng" />
        <MeterBar value={playerEnergy} max={100} color="#22c55e" label="Sức" />
        <MeterBar value={dog.hunger} max={100} color="#a78bfa" label="Dũng" />
        <MeterBar value={dog.loyalty} max={100} color="#f472b6" label="Trung" />
      </div>

      {(taxSuspicion > 0 || mobAnger > 0) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 pt-2 border-t-2 border-dashed border-dark-brown/50">
          {taxSuspicion > 0 && <MeterBar value={taxSuspicion} max={100} color="#ef4444" label="Thuế" />}
          {mobAnger > 0 && <MeterBar value={mobAnger} max={100} color="#f97316" label="Dân" />}
        </div>
      )}
    </div>
  );
}
