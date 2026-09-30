import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { audioManager } from './audio/AudioManager';
import { PreGameDisclaimerModal } from './components/PreGameDisclaimerModal';
import { TitleScreen } from './components/TitleScreen';
import { IntroDialogue } from './components/IntroDialogue';
import { MorningPhase } from './components/MorningPhase';
import { JobSelect } from './components/JobSelect';
import { SingleFrameHUD } from './components/SingleFrameHUD';
import { NightSettlement } from './components/NightSettlement';
import { JailCell } from './components/JailCell';
import { WeddingCutscene } from './components/WeddingCutscene';
import { EndingScreen } from './components/EndingScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { DisclaimerScreen } from './components/DisclaimerScreen';
import { MemorialScreen } from './components/MemorialScreen';
import { WastedModal } from './components/WastedModal';

export default function App() {
  const stage = useGameStore((s: any) => s.stage);
  const isSoundOn = useGameStore((s: any) => s.isSoundOn);

  useEffect(() => {
    if (stage !== 'DISCLAIMER' && isSoundOn) {
      audioManager.init();
    }
  }, [stage, isSoundOn]);

  const renderStage = () => {
    switch (stage) {
      case 'DISCLAIMER': return <PreGameDisclaimerModal />;
      case 'TITLE': return <TitleScreen />;
      case 'INTRO_DIALOGUE': return <IntroDialogue />;
      case 'MORNING_PHASE': return <MorningPhase />;
      case 'JOB_SELECT': return <JobSelect />;
      case 'WORKING': return <SingleFrameHUD />;
      case 'NIGHT_SETTLEMENT': return <NightSettlement />;
      case 'JAIL_CELL': return <JailCell />;
      case 'WEDDING_CUTSCENE': return <WeddingCutscene />;
      case 'ENDING': return <EndingScreen />;
      case 'GAME_OVER': return <GameOverScreen />;
      case 'DISCLAIMER_POST_GAME': return <DisclaimerScreen />;
      case 'MEMORIAL': return <MemorialScreen />;
      case 'WASTED': return <WastedModal />;
      default: return <TitleScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0704] flex items-center justify-center font-sans">
      <div className="max-w-[440px] w-full h-[100dvh] max-h-[920px] aspect-[9/16] relative overflow-hidden shadow-2xl border-x-4 border-y-0 border-[#3f2010] bg-[#1a0e08]">
        {renderStage()}
      </div>
    </div>
  );
}
