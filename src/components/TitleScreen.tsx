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
      <div className="absolute inset-0 z-0 bg-[#1e1e24] overflow-hidden">
        {/* Simple Pixel Art Stars */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-white opacity-50 shadow-[20px_40px_0_white,100px_10px_0_white,150px_60px_0_white,250px_20px_0_white,320px_80px_0_white]" />
        {/* Distant City Silhouette (Flat Pixel Art) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#111115]">
          <div className="absolute bottom-16 left-4 w-12 h-20 bg-[#111115]" />
          <div className="absolute bottom-16 left-20 w-8 h-12 bg-[#111115]" />
          <div className="absolute bottom-16 left-32 w-16 h-24 bg-[#111115]" />
          <div className="absolute bottom-16 left-60 w-10 h-16 bg-[#111115]" />
          <div className="absolute bottom-16 left-80 w-14 h-28 bg-[#111115]" />
        </div>
      </div>
      
      <div className="relative z-10 w-full mt-24 flex flex-col items-center">
         <h1 className="text-4xl text-[#fcc419] font-black pixel-text-shadow text-center leading-tight">MỖI NGÀY<br/>MỘT NGHỀ</h1>
         <p className="text-white mt-2 text-sm pixel-text-shadow">Sinh Tồn Vỉa Hè (16-bit)</p>
      </div>

      <div className="relative z-10 w-full max-w-[280px] mt-auto pb-8 animate-fade-in-up space-y-3">
        <button
          onClick={handleStart}
          className="w-full pixel-btn-red text-2xl"
        >
          {day > 1 ? 'TIẾP TỤC' : 'BẮT ĐẦU'}
        </button>

        <button
          onClick={() => { audioManager.playBlipSFX(); setShowRoadmap(true); }}
          className="w-full pixel-btn-gold text-lg"
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
