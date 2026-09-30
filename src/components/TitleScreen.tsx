import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager, TrackId } from '../audio/AudioManager';
import { RoadmapModal } from './RoadmapModal';

export function TitleScreen() {
  const startGame = useGameStore(s => s.startGame);
  const day = useGameStore(s => s.day);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [track, setTrack] = useState<TrackId>('TRACK_1');

  const handleStart = () => {
    audioManager.playBlipSFX();
    startGame();
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center select-none bg-[#1e1e24] overflow-hidden">
      {/* Background: flat pixel art sky + silhouette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/backgrounds/title_bg_clean.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Fallback: simple pixel stars if image missing */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-white opacity-50 shadow-[20px_40px_0_white,100px_10px_0_white,150px_60px_0_white,250px_20px_0_white,320px_80px_0_white]" />
      </div>

      {/* Title */}
      <div className="relative z-10 w-full mt-20 flex flex-col items-center px-4">
        <h1 className="font-[VT323] text-5xl text-[#fbc02d] pixel-text-shadow text-center leading-tight tracking-wider">
          MỖI NGÀY<br/>MỘT NGHỀ
        </h1>
        <p className="font-[Share_Tech_Mono] text-white/70 mt-2 text-sm pixel-text-shadow">
          Sinh Tồn Vỉa Hè (16-bit)
        </p>
      </div>

      {/* Buttons */}
      <div className="relative z-10 w-full max-w-[280px] mt-auto pb-8 animate-slide-up space-y-3 px-4">
        <button onClick={handleStart} className="pixel-btn pixel-btn-red w-full font-[VT323] text-2xl py-3">
          {day > 1 ? 'TIẾP TỤC' : 'BẮT ĐẦU'}
        </button>

        <button
          onClick={() => { audioManager.playBlipSFX(); setShowRoadmap(true); }}
          className="pixel-btn pixel-btn-gold w-full font-[VT323] text-xl py-2"
        >
          NHẬT KÝ SỐ PHẬN
        </button>

        <div className="pt-2 flex flex-col items-center gap-2">
          <select
            value={track}
            onChange={(e) => { const t = e.target.value as TrackId; setTrack(t); audioManager.playBGM(t); }}
            className="bg-[#3e2723] text-[#f4ecd8] border-2 border-[#78471c] p-1 font-[VT323] text-base outline-none cursor-pointer"
          >
            <option value="TRACK_1">Hà Nội Buổi Chiều</option>
            <option value="TRACK_2">Hối Hả Vỉa Hè</option>
            <option value="TRACK_3">Đêm Gầm Cầu</option>
          </select>
          <button
            onClick={() => audioManager.setMute(!audioManager.isMuted)}
            className="font-[Share_Tech_Mono] text-sm text-[#f4ecd8]/70 hover:text-[#f4ecd8] underline"
          >
            {audioManager.isMuted ? 'BẬT ÂM' : 'TẮT ÂM'}
          </button>
        </div>
      </div>

      {showRoadmap && <RoadmapModal onClose={() => setShowRoadmap(false)} />}
    </div>
  );
}
