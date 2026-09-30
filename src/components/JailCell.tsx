
import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { DialogueModal, Choice } from './DialogueModal';
import { PRISON_DIALOGUES } from '../data/dialogues';

export function JailCell() {
  const store = useGameStore();
  const [lineIdx, setLineIdx] = useState(0);
  const clashLines = PRISON_DIALOGUES.CLASH;
  
  const choices: Choice[] = [
    { label: '[ Cùng vượt ngục với Anh Tôm ]', action: () => { store.setJailChoice('ESCAPE'); store.resolveJail(); } },
    { label: '[ Can ngăn 2 người đừng cãi nhau nữa ]', action: () => { store.setJailChoice('INTERVENE'); store.resolveJail(); } },
    { label: '[ Im lặng nằm xuống ngủ ]', action: () => { store.setJailChoice('SLEEP'); store.resolveJail(); } }
  ];

  const handleNextLine = () => {
    if (lineIdx < clashLines.length - 1) {
      setLineIdx(prev => prev + 1);
    }
  };

  const currentLine = clashLines[lineIdx];
  const isLastLine = lineIdx === clashLines.length - 1;
  const speakerIdMap: Record<string, string> = {
    'Tom': 'tom',
    'Khoa': 'sv_bachkhoa',
    'Main': 'hero'
  };

  return (
    <div className="absolute inset-0 bg-[#0c0a09] font-game">
      {/* Background with CSS fallback if image missing */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url(/backgrounds/jail_cell.png)', imageRendering: 'pixelated' }}
      />
      <div className="absolute bottom-10 left-4 right-4 z-10 h-[220px]">
        <DialogueModal 
          speakerId={speakerIdMap[currentLine.speaker] || 'tom'}
          speakerName={currentLine.speaker === 'Main' ? 'Bạn' : currentLine.speaker}
          text={currentLine.text}
          onComplete={handleNextLine}
          choices={isLastLine ? choices : undefined}
        />
      </div>
    </div>
  );
}
