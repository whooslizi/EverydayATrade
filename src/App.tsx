import { useGameStore } from './store/useGameStore';
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
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />
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
    <div className="w-full h-[100dvh] bg-[#0c0a09] flex items-center justify-center p-0 md:p-3 overflow-hidden select-none font-game">
      <div className="relative w-full h-full max-h-[100dvh] aspect-[9/16] max-w-[440px] bg-[#1a120b] border-0 md:border-2 border-[#3c2415] shadow-2xl flex flex-col overflow-hidden">
        <GameCanvas />
      </div>
    </div>
  );
}
