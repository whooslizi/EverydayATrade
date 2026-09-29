// ====== JOB SELECT ======
import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { JOBS, formatVND } from '../data/gameData';
import { audioManager } from '../audio/AudioManager';;
import type { Job } from '../types';

export function JobSelect() {
  const store = useGameStore();
  const [rolled, setRolled] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const rollJobs = () => {
    if (store.isSoundOn) audioManager.playBlipSFX();
    setIsRolling(true);

    // Shuffle and pick 2-3 jobs
    const shuffled = [...JOBS].sort(() => Math.random() - 0.5);
    const count = Math.random() < 0.3 ? 2 : 3;

    // Animate rolling
    let ticks = 0;
    const maxTicks = 12;
    const interval = setInterval(() => {
      ticks++;
      setAvailableJobs(
        [...JOBS].sort(() => Math.random() - 0.5).slice(0, count),
      );
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setAvailableJobs(shuffled.slice(0, count));
        setRolled(true);
        setIsRolling(false);
      }
    }, 100);
  };

  const selectJob = (job: Job) => {
    if (store.isSoundOn) audioManager.playBlipSFX();
    store.selectJob(job);
  };

  return (
    <div className="absolute inset-0 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #92400e 0%, #b45309 30%, #d97706 60%, #f59e0b 100%)',
      }}
    >
      <div className="text-center py-3">
        <span className="font-pixel text-parchment text-base tracking-wider">
           VÉ NHẬT KÝ — NGÀY {store.day}
        </span>
        <p className="text-sm text-parchment/60 font-game mt-1">
          Bốc vé xem hôm nay làm nghề gì!
        </p>
      </div>

      {!rolled ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            {/* Ticket animation */}
            <div
              className={`text-5xl mb-4 ${isRolling ? 'animate-shake' : 'animate-float'}`}
            >
              ️
            </div>

            {isRolling ? (
              <div className="space-y-1">
                {availableJobs.map((job, i) => (
                  <div key={`rolling-${i}`} className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg text-center py-1 animate-slide-up">
                    <span className="text-lg">{job.icon}</span>
                    <span className="text-[9px] font-pixel text-[#e8dcdc] ml-2">
                      {job.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={rollJobs}
                className="bg-[#fcc419] text-[#1a1414] font-bold py-3 px-4 rounded-[12px] shadow-[0_4px_0_#e67700] hover:bg-[#fab005] active:translate-y-1 active:shadow-none transition-all w-full text-sm px-8 py-3"
              >
                 BỐC VÉ!
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          <p className="text-[9px] text-parchment/80 font-game text-center mb-2">
            Chọn nghề hôm nay:
          </p>

          <div className="space-y-2">
            {availableJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => selectJob(job)}
                className="bg-[#1a1414] border-2 border-[#3e3030] rounded-[16px] p-4 text-[#e8dcdc] shadow-lg w-full text-left hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{job.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-pixel text-[#e8dcdc]">{job.name}</div>
                    <p className="text-sm text-[#e8dcdc]/70 font-game mt-0.5">
                      {job.description}
                    </p>
                    <p className="text-sm text-[#e8dcdc]/50 font-game italic mt-0.5">
                      {job.flavorText}
                    </p>
                    <div className="flex gap-3 mt-1 text-sm font-pixel">
                      <span className="text-red-accent">
                        Vốn: {formatVND(job.baseCost)}
                      </span>
                      <span className="text-green-700">
                        ~Thu: {formatVND(job.baseRevenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
