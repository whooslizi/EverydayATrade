
import { useGameStore } from '../store/useGameStore';
import { DialogueModal } from './DialogueModal';
import { INTRO_DIALOGUES } from '../data/gameData';

export function IntroDialogue() {
  const store = useGameStore();
  const dialogue = INTRO_DIALOGUES[store.dialogueIndex];

  if (!dialogue) {
    store.advanceDialogue();
    return null;
  }
  
  return (
    <div className="absolute inset-0 bg-[#0c0a09] font-game">
      <button 
        onClick={() => store.setStage('MORNING_PHASE')}
        className="absolute top-4 right-4 z-50 text-[#fef3c7] font-['VT323'] text-xl underline opacity-70 hover:opacity-100"
      >
        [ BỎ QUA GIỚI THIỆU ]
      </button>
      <DialogueModal 
        speakerId="unknown"
        speakerName="Nhật Ký"
        text={dialogue}
        onComplete={() => store.advanceDialogue()}
      />
    </div>
  );
}
