import useGameStore from '../store/useGameStore';
import { INTRO_DIALOGUES } from '../data/gameData';
import DialogueModal from './DialogueModal';

export default function IntroDialogue() {
  const dialogueIndex = useGameStore((s) => s.dialogueIndex);
  const advanceDialogue = useGameStore((s) => s.advanceDialogue);

  const currentText = INTRO_DIALOGUES[dialogueIndex] ?? '';

  return (
    <div className="relative w-full h-full bg-[#0c0a09]">
      <DialogueModal
        speakerId="narrator"
        speakerName="Nhật Ký"
        text={currentText}
        onComplete={advanceDialogue}
      />
    </div>
  );
}
