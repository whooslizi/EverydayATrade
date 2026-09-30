
import { useState, useEffect } from 'react';
import { audioManager } from '../audio/AudioManager';

export interface Choice {
  label: string;
  action: () => void;
  disabled?: boolean;
}

interface Props {
  speakerId: string;
  speakerName: string;
  text: string;
  onComplete?: () => void;
  choices?: Choice[];
}

export function DialogueModal({ speakerName, text, onComplete, choices }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        if (i % 3 === 0) audioManager.playBlipSFX();
        i++;
      } else {
        setIsDone(true);
        clearInterval(t);
      }
    }, 25);
    return () => clearInterval(t);
  }, [text]);

  return (
    <div className="absolute inset-x-4 bottom-8 pixel-panel shadow-2xl flex flex-col z-50 animate-slide-up" onClick={() => { if(!choices) onComplete?.(); }}>
      <h3 className="text-[#fcc419] font-black text-lg mb-2 uppercase">{speakerName}</h3>
      <p className="text-[#e8dcdc] text-base leading-relaxed min-h-[60px]">{displayed}</p>
      {isDone && choices && (
        <div className="mt-4 flex flex-col gap-2">
          {choices.map((c, idx) => (
            <button key={idx} onClick={(e) => { e.stopPropagation(); c.action(); }} className="pixel-btn-gray text-left">
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
