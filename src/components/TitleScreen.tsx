import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager, TrackId } from '../audio/AudioManager';
import { RoadmapModal } from './RoadmapModal';

export function TitleScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const day = useGameStore((s) => s.day);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [track, setTrack] = useState<TrackId>('TRACK_1');

  const handleStart = () => {
    audioManager.playBlipSFX();
    startGame();
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTrack = e.target.value as TrackId;
    setTrack(newTrack);
    audioManager.playBGM(newTrack);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center font-game select-none bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0">
        <img 
          src="/sprites/title_bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover object-[center_center]"
        />
        {/* We remove the heavy gradient so the image pops */}
      </div>

      <div className="relative z-10 w-full max-w-[280px] mt-auto pb-8 animate-fade-in-up space-y-3">
        <button
          onClick={handleStart}
          className="w-full bg-[#b91c1c] text-[#fdf6e2] font-pixel text-2xl py-3 border-4 border-[#3c2415] hover:bg-[#991b1b] transition-colors drop-shadow-[4px_4px_0px_#1a0f0a] active:translate-y-1 active:shadow-none"
        >
          {day > 1 ? 'TIẾP TỤC' : 'BẮT ĐẦU'}
        </button>

        <button
          onClick={() => { audioManager.playBlipSFX(); setShowRoadmap(true); }}
          className="w-full bg-[#3c2415] text-[#fde68a] font-pixel text-xl py-2 border-4 border-[#d4a637] hover:bg-[#2d1b11] transition-colors drop-shadow-[4px_4px_0px_#1a0f0a] active:translate-y-1 active:shadow-none"
        >
          NHẬT KÝ SỐ PHẬN
        </button>

        <div className="pt-2 flex flex-col items-center">
          <select 
            value={track} 
            onChange={handleTrackChange}
            className="bg-[#3c2415] text-[#fdf6e2] border-2 border-[#d4a637] p-1 font-pixel text-sm outline-none cursor-pointer mb-2"
          >
            <option value="TRACK_1">Hà Nội Buổi Chiều</option>
            <option value="TRACK_2">Hối Hả Vỉa Hè</option>
            <option value="TRACK_3">Đêm Gầm Cầu</option>
          </select>
          
          <button
            onClick={() => audioManager.setMute(!audioManager.isMuted)}
            className="text-sm text-[#fdf6e2]/80 hover:text-[#fdf6e2] underline font-pixel"
          >
            {audioManager.isMuted ? 'BẬT ÂM' : 'TẮT ÂM'}
          </button>
        </div>
      </div>

      {showRoadmap && <RoadmapModal onClose={() => setShowRoadmap(false)} />}
    </div>
  );
}
