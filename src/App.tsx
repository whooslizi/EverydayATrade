import { useState, useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { audioManager } from './audio/AudioManager';
import { PreGameDisclaimerModal } from './components/PreGameDisclaimerModal';
import { TitleScreen } from './components/TitleScreen';
import { IntroDialogue } from './components/IntroDialogue';
import { MorningPhase } from './components/MorningPhase';
import { JobSelect } from './components/JobSelect';
import { WorkingPhase } from './components/WorkingPhase';
import { NightSettlement } from './components/NightSettlement';
import { JailCell } from './components/JailCell';
import { WeddingCutscene } from './components/WeddingCutscene';
import { EndingScreen } from './components/EndingScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { DisclaimerScreen } from './components/DisclaimerScreen';
import { MemorialScreen } from './components/MemorialScreen';
import { GameHUD } from './components/GameHUD';
import { WastedTransition } from './components/WastedTransition';

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'd';
}

// Desktop side panel: Finance + Audio
function LeftPanel() {
  const debt = useGameStore(s => s.debt);
  const interest = useGameStore(s => s.dailyInterest);
  const energy = useGameStore(s => s.playerEnergy);
  const hunger = useGameStore(s => s.playerHunger);
  const dog = useGameStore(s => s.dog);
  const isSoundOn = useGameStore(s => s.isSoundOn);
  const toggleSound = useGameStore(s => s.toggleSound);

  return (
    <div className="hidden xl:flex flex-col w-[280px] pixel-panel-dark gap-4 h-full max-h-[800px] overflow-y-auto">
      <h2 className="font-[VT323] text-xl text-[#fbc02d] pixel-text-shadow uppercase">BẢNG TÀI CHÍNH</h2>
      <div className="pixel-panel p-3">
        <p className="font-[Share_Tech_Mono] text-xs text-[#78716c]">Nợ Cụ Bá:</p>
        <p className="font-[VT323] text-3xl text-[#d32f2f]">{formatVND(debt)}</p>
        <p className="font-[Share_Tech_Mono] text-xs text-[#991b1b] mt-1">Lãi đêm: -{formatVND(interest)}</p>
      </div>

      <h2 className="font-[VT323] text-xl text-[#fbc02d] pixel-text-shadow uppercase">SINH TỒN</h2>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between font-[VT323] text-base"><span>Năng Lượng</span><span>{energy}%</span></div>
          <div className="retro-gauge"><div className="retro-gauge-fill bg-blue-500" style={{width:`${energy}%`}} /></div>
        </div>
        <div>
          <div className="flex justify-between font-[VT323] text-base"><span>Độ No</span><span>{hunger}%</span></div>
          <div className="retro-gauge"><div className="retro-gauge-fill bg-green-500" style={{width:`${hunger}%`}} /></div>
        </div>
        <div>
          <div className="flex justify-between font-[VT323] text-base"><span>Dung (Độ No)</span><span>{dog.hunger}%</span></div>
          <div className="retro-gauge"><div className="retro-gauge-fill bg-yellow-500" style={{width:`${dog.hunger}%`}} /></div>
        </div>
      </div>

      <div className="mt-auto">
        <h2 className="font-[VT323] text-lg text-[#fbc02d] pixel-text-shadow uppercase mb-2">ÂM THANH</h2>
        <button
          onClick={() => { toggleSound(); audioManager.setMute(!isSoundOn); }}
          className="pixel-btn pixel-btn-gray w-full font-[VT323] text-lg"
        >
          {isSoundOn ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
        </button>
      </div>
    </div>
  );
}

// Desktop side panel: Controls + Info
function RightPanel() {
  const setStage = useGameStore(s => s.setStage);
  const stage = useGameStore(s => s.stage);
  const showPause = stage !== 'TITLE' && stage !== 'INTRO_DIALOGUE' && stage !== 'ENDING' && stage !== 'GAME_OVER' && stage !== 'MEMORIAL' && stage !== 'DISCLAIMER_POST_GAME';

  return (
    <div className="hidden xl:flex flex-col w-[280px] pixel-panel-dark gap-4 h-full max-h-[800px]">
      <h2 className="font-[VT323] text-xl text-[#4dabf7] pixel-text-shadow uppercase">ĐIỀU KHIỂN</h2>
      <div className="pixel-panel p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['W','A','S','D'].map(k => (
              <kbd key={k} className="bg-[#3e2723] text-[#f4ecd8] font-[VT323] text-lg px-2 py-0.5 border-b-2 border-[#1a1414] min-w-[28px] text-center">{k}</kbd>
            ))}
          </div>
          <span className="font-[Share_Tech_Mono] text-sm">Di chuyển</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="bg-[#3e2723] text-[#f4ecd8] font-[VT323] text-lg px-3 py-0.5 border-b-2 border-[#1a1414]">Space</kbd>
          <span className="font-[Share_Tech_Mono] text-sm">Tương tác</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="bg-[#3e2723] text-[#f4ecd8] font-[VT323] text-lg px-3 py-0.5 border-b-2 border-[#1a1414]">Click</kbd>
          <span className="font-[Share_Tech_Mono] text-sm">Kéo thả</span>
        </div>
      </div>

      {showPause && (
        <button
          onClick={() => { audioManager.playBlipSFX(); setStage('TITLE'); }}
          className="pixel-btn pixel-btn-red font-[VT323] text-lg w-full"
        >
          VỀ MÀN HÌNH CHÍNH
        </button>
      )}

      <div className="mt-auto text-center font-[Share_Tech_Mono] text-xs text-[#78716c]">
        <p>Moi Ngay Mot Nghe</p>
        <p>(Everyday A Trade)</p>
        <p>Phien ban 1.0.0</p>
      </div>
    </div>
  );
}

function GameCanvas() {
  const stage = useGameStore(s => s.stage);

  const showHUD = !['TITLE','INTRO_DIALOGUE','GAME_OVER','ENDING','DISCLAIMER_POST_GAME','MEMORIAL'].includes(stage);

  const renderStage = () => {
    switch (stage) {
      case 'TITLE': return <TitleScreen />;
      case 'INTRO_DIALOGUE': return <IntroDialogue />;
      case 'MORNING_PHASE': return <MorningPhase />;
      case 'JOB_SELECT': return <JobSelect />;
      case 'WORKING': case 'SELLING': return <WorkingPhase />;
      case 'NIGHT_SETTLEMENT': return <NightSettlement />;
      case 'JAIL_CELL': return <JailCell />;
      case 'WEDDING_CUTSCENE': return <WeddingCutscene />;
      case 'ENDING': return <EndingScreen />;
      case 'GAME_OVER': return <GameOverScreen />;
      case 'DISCLAIMER_POST_GAME': return <DisclaimerScreen />;
      case 'MEMORIAL': return <MemorialScreen />;
      default: return <TitleScreen />;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {showHUD && <GameHUD />}
      <div className="flex-1 overflow-hidden relative">
        {renderStage()}
      </div>
    </div>
  );
}

export default function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('disclaimer_accepted') === 'true';
  });

  // Global first-click audio unlocker
  useEffect(() => {
    const unlock = () => {
      audioManager.init();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  if (!disclaimerAccepted) {
    return <PreGameDisclaimerModal onAccept={() => setDisclaimerAccepted(true)} />;
  }

  return (
    <div className="w-full h-[100dvh] bg-[#111115] flex items-center justify-center gap-4 p-0 xl:p-4 overflow-hidden select-none">
      <LeftPanel />

      <div className="relative w-full h-full max-h-[100dvh] xl:max-h-[800px] aspect-[9/16] max-w-[440px] bg-[#1e1e24] border-0 xl:border-4 xl:border-[#78471c] shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-20">
        {/* CRT scanline overlay */}
        <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px]" />
        <GameCanvas />
        <WastedTransition />
      </div>

      <RightPanel />
    </div>
  );
}
