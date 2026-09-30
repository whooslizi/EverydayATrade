import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { JOBS } from '../data/gameData';

export function JobSelect() {
  const store = useGameStore();

  return (
    <div className="absolute inset-0 flex flex-col bg-[#231812] overflow-y-auto custom-scrollbar">
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h2 className="font-[VT323] text-2xl text-[#fbc02d] pixel-text-shadow uppercase text-center">
          CHỌN NGHỀ HÔM NAY
        </h2>

        {JOBS.map(job => (
          <button
            key={job.id}
            onClick={() => { audioManager.playBlipSFX(); store.selectJob(job); }}
            className="pixel-panel p-3 text-left w-full hover:border-[#fbc02d] transition-colors cursor-pointer"
          >
            <h3 className="font-[VT323] text-xl text-[#3e2723] uppercase">{job.name}</h3>
            <p className="font-[Share_Tech_Mono] text-sm text-[#78716c] mt-1">{job.description}</p>
            <p className="font-[Share_Tech_Mono] text-xs text-[#78350f] italic mt-1">{job.flavorText}</p>
          </button>
        ))}
      </div>

      <div className="sticky bottom-0 p-3 bg-[#231812] border-t-4 border-[#78471c]">
        <button
          onClick={() => { audioManager.playBlipSFX(); store.setStage('MORNING_PHASE'); }}
          className="pixel-btn pixel-btn-gray w-full font-[VT323] text-lg"
        >
          QUAY LẠI
        </button>
      </div>
    </div>
  );
}
