import { useEffect, useState } from 'react';
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
  const store = useGameStore((s: any) => s);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(
    localStorage.getItem('disclaimer_accepted') === 'true'
  );

  useEffect(() => {
    if (disclaimerAccepted && store.isSoundOn) {
      audioManager.init();
    }
  }, [disclaimerAccepted, store.isSoundOn]);

  const renderStage = () => {
    switch (store.stage) {
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
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#0c0704] flex items-center justify-center overflow-hidden select-none font-['VT323']">
      <div className="relative h-full aspect-[9/16] max-w-[500px] w-full bg-[#1a0e08] border-x-4 border-[#3f2010] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden">
        {!disclaimerAccepted ? (
          <PreGameDisclaimerModal onAccept={() => setDisclaimerAccepted(true)} />
        ) : (
          renderStage()
        )}
      </div>
    </div>
  );
}
