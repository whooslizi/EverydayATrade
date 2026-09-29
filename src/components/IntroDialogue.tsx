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
  
  let speakerName = 'Nhật Ký';
  let text = dialogue;
  let speakerId = 'unknown';

  text = dialogue;

  return (
    <div className="absolute inset-0 bg-[#0c0a09] font-game">
      <DialogueModal 
        speakerId={speakerId}
        speakerName={speakerName}
        text={text}
        onComplete={() => store.advanceDialogue()}
      />
    </div>
  );
}
