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

  useEffect(() => {
    if (choices && choices.length > 0) return; // Wait for choice click

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (isDone) {
          audioManager.playBlipSFX();
          if (onComplete) onComplete();
        } else {
          setDisplayed(text);
          setIsDone(true);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDone, text, onComplete, choices]);

  return (
    <div className="absolute inset-x-4 bottom-8 bg-[#1a1414]/95 border-2 border-[#3e3030] rounded-[20px] p-5 shadow-2xl flex flex-col z-50 animate-slide-up" 
      onClick={() => {
        if (choices && choices.length > 0) return;
        if (isDone) {
          audioManager.playBlipSFX();
          if (onComplete) onComplete();
        } else {
          setDisplayed(text);
          setIsDone(true);
        }
    }}>
      <h3 className="text-[#fcc419] font-black text-lg mb-2 uppercase tracking-wide">{speakerName}</h3>
      <p className="text-[#e8dcdc] text-base leading-relaxed min-h-[60px]">{displayed}</p>
      
      {isDone && choices && choices.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {choices.map((c, idx) => (
            <button
              key={idx}
              disabled={c.disabled}
              onClick={(e) => {
                e.stopPropagation();
                if (!c.disabled) {
                  audioManager.playBlipSFX();
                  c.action();
                }
              }}
              className="bg-[#2d2222] text-[#fdf6e2] font-bold text-sm py-3 px-4 rounded-[12px] border-2 border-[#3e3030] hover:bg-[#3e3030] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {isDone && (!choices || choices.length === 0) && (
        <div className="text-right mt-2 text-[#ff6b6b] text-sm font-bold animate-pulse">
          [ Nhấn Space hoặc Click ]
        </div>
      )}
    </div>
  );
}
