import { useGameStore } from './store/useGameStore';
import { audioManager } from './audio/AudioManager';
import { DisclaimerScreen } from './components/DisclaimerScreen';
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
import { GameHUD } from './components/GameHUD';
import { MemorialScreen } from './components/MemorialScreen';

function LeftWing() {
  const debt = useGameStore(s => s.debt);
  const interest = useGameStore(s => s.dailyInterest);
  const playerEnergy = useGameStore(s => s.playerEnergy);
  const dog = useGameStore(s => s.dog);
  const isSoundOn = useGameStore(s => s.isSoundOn);
  const toggleSound = useGameStore(s => s.toggleSound);
  
  return (
    <div className="hidden xl:flex flex-col w-[300px] h-full max-h-[800px] bg-[#2d2222] border-4 border-[#3e3030] rounded-[24px] p-6 text-[#fdf6e2] shadow-2xl relative z-10">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff6b6b] text-white font-black px-4 py-1 rounded-full text-sm tracking-wider shadow-md">TRẠM ĐIỀU KHIỂN</div>
      
      <h2 className="font-bold text-xl mb-3 text-[#ff6b6b] mt-4">Bảng Tài Chính</h2>
      <div className="bg-[#1a1414] p-4 rounded-xl mb-6 border-2 border-[#3e3030] shadow-inner">
        <p className="text-sm text-gray-400 font-bold mb-1">Nợ Cụ Bá:</p>
        <p className="text-3xl font-black text-[#fa5252]">{debt.toLocaleString('vi-VN')}đ</p>
        <div className="mt-2 bg-[#fa5252]/10 p-2 rounded-lg flex items-center justify-between">
          <span className="text-xs text-[#ff6b6b] font-bold">Lãi suất đêm:</span>
          <span className="text-sm text-[#ff6b6b] font-black">-{interest.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
      
      <h2 className="font-bold text-xl mb-3 text-[#ff6b6b]">Sinh Tồn</h2>
      <div className="bg-[#1a1414] p-4 rounded-xl mb-6 border-2 border-[#3e3030] shadow-inner space-y-4">
         <div>
           <div className="flex justify-between text-sm font-bold mb-1"><span className="text-blue-300">Năng Lượng</span><span>{playerEnergy}%</span></div>
           <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-[#3e3030]"><div className="h-full bg-blue-500" style={{width: `${playerEnergy}%`}}></div></div>
         </div>
         <div>
           <div className="flex justify-between text-sm font-bold mb-1"><span className="text-yellow-400">Độ No (Dũng)</span><span>{dog.hunger}%</span></div>
           <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-[#3e3030]"><div className="h-full bg-yellow-400" style={{width: `${dog.hunger}%`}}></div></div>
         </div>
      </div>
      
      <div className="mt-auto">
        <h2 className="font-bold text-xl mb-3 text-[#ff6b6b]">Âm Thanh</h2>
        <button onClick={() => { toggleSound(); audioManager.setMute(!isSoundOn); }} className="w-full bg-[#4a3939] text-[#fdf6e2] py-3 rounded-xl font-bold border-2 border-[#3e3030] hover:bg-[#5a4646] transition-colors">
          {isSoundOn ? '🔊 Đang Bật' : '🔇 Đã Tắt'}
        </button>
      </div>
    </div>
  );
}

function RightWing() {
  return (
    <div className="hidden xl:flex flex-col w-[300px] h-full max-h-[800px] bg-[#2d2222] border-4 border-[#3e3030] rounded-[24px] p-6 text-[#fdf6e2] shadow-2xl relative z-10">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4dabf7] text-white font-black px-4 py-1 rounded-full text-sm tracking-wider shadow-md">HƯỚNG DẪN</div>
      
      <h2 className="font-bold text-xl mb-4 text-[#4dabf7] mt-4">Điều Khiển</h2>
      <div className="bg-[#1a1414] p-4 rounded-xl mb-6 border-2 border-[#3e3030] space-y-4">
         <div className="flex items-center gap-3">
           <kbd className="bg-[#3e3030] border-b-2 border-[#1a1414] text-white px-2 py-1 rounded-lg font-bold text-sm min-w-[36px] text-center">W</kbd>
           <kbd className="bg-[#3e3030] border-b-2 border-[#1a1414] text-white px-2 py-1 rounded-lg font-bold text-sm min-w-[36px] text-center">A</kbd>
           <kbd className="bg-[#3e3030] border-b-2 border-[#1a1414] text-white px-2 py-1 rounded-lg font-bold text-sm min-w-[36px] text-center">S</kbd>
           <kbd className="bg-[#3e3030] border-b-2 border-[#1a1414] text-white px-2 py-1 rounded-lg font-bold text-sm min-w-[36px] text-center">D</kbd>
           <span className="text-sm font-medium text-gray-300 ml-2">Di chuyển</span>
         </div>
         <div className="flex items-center gap-3">
           <kbd className="bg-[#3e3030] border-b-2 border-[#1a1414] text-white px-4 py-1 rounded-lg font-bold text-sm text-center w-[120px]">Space</kbd>
           <span className="text-sm font-medium text-gray-300">Tương tác</span>
         </div>
         <div className="flex items-center gap-3">
           <kbd className="bg-[#3e3030] border-b-2 border-[#1a1414] text-white px-4 py-1 rounded-lg font-bold text-sm text-center w-[120px]">Chuột</kbd>
           <span className="text-sm font-medium text-gray-300">Kéo thả đồ</span>
         </div>
      </div>
      
      <div className="mt-auto opacity-70">
        <p className="text-xs text-center text-gray-400">
          Mỗi Ngày Một Nghề<br/>
          (Everyday A Trade)<br/>
          Phiên bản 1.0.0
        </p>
      </div>
    </div>
  );
}

function GameCanvas() {
  const stage = useGameStore((s) => s.stage);

  const renderStage = () => {
    switch (stage) {
      case 'TITLE':
        return <TitleScreen />;
      case 'INTRO_DIALOGUE':
        return <IntroDialogue />;
      case 'MORNING_PHASE':
        return <MorningPhase />;
      case 'JOB_SELECT':
        return <JobSelect />;
      case 'WORKING':
      case 'SELLING':
        return <WorkingPhase />;
      case 'NIGHT_SETTLEMENT':
        return <NightSettlement />;
      case 'JAIL_CELL':
        return <JailCell />;
      case 'WEDDING_CUTSCENE':
        return <WeddingCutscene />;
      case 'ENDING':
        return <EndingScreen />;
      case 'GAME_OVER':
        return <GameOverScreen />;
      case 'DISCLAIMER_POST_GAME':
        return <DisclaimerScreen />;
      case 'MEMORIAL':
        return <MemorialScreen />;
      default:
        return <TitleScreen />;
    }
  };

  const showHUD =
    stage !== 'TITLE' &&
    stage !== 'INTRO_DIALOGUE' &&
    stage !== 'GAME_OVER' &&
    stage !== 'ENDING' &&
    stage !== 'DISCLAIMER_POST_GAME' &&
    stage !== 'MEMORIAL';

  return (
    <>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {showHUD && <GameHUD />}
        <div className="flex-1 overflow-hidden relative">
          {renderStage()}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <div className="w-full h-[100dvh] bg-[#1a1414] flex items-center justify-center gap-8 p-0 md:p-6 overflow-hidden select-none font-sans">
      <LeftWing />
      
      <div className="relative w-full h-full max-h-[100dvh] xl:max-h-[800px] aspect-[9/16] max-w-[440px] bg-[#2d2222] border-0 xl:border-8 border-[#3e3030] xl:rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-20">
        {/* CRT Scanline Overlay applied only to the mobile canvas */}
        <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(26,20,20,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px]" />
        
        <GameCanvas />
      </div>

      <RightWing />
    </div>
  );
}
