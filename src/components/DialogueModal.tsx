import { useState, useEffect, useCallback, useRef } from 'react';
import audioManager from '../audio/AudioManager';

export interface Choice {
  label: string;
  action: () => void;
  disabled?: boolean;
}

interface DialogueModalProps {
  speakerId: string;
  speakerName: string;
  text: string;
  onComplete?: () => void;
  choices?: Choice[];
}

export default function DialogueModal({
  speakerId,
  speakerName,
  text,
  onComplete,
  choices,
}: DialogueModalProps) {
  const [displayedLen, setDisplayedLen] = useState(0);
  const [finished, setFinished] = useState(false);
  const charIndex = useRef(0);

  useEffect(() => {
    charIndex.current = 0;
    setDisplayedLen(0);
    setFinished(false);
  }, [text, speakerId]);

  useEffect(() => {
    if (finished) return;

    const interval = setInterval(() => {
      charIndex.current += 1;
      if (charIndex.current % 3 === 0) {
        audioManager.playBlipSFX();
      }
      setDisplayedLen(charIndex.current);
      if (charIndex.current >= text.length) {
        setFinished(true);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text, finished]);

  const handleAdvance = useCallback(() => {
    if (!finished) {
      charIndex.current = text.length;
      setDisplayedLen(text.length);
      setFinished(true);
      return;
    }
    if (!choices && onComplete) {
      onComplete();
    }
  }, [finished, text, choices, onComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleAdvance]);

  return (
    <div
      className="pixel-panel absolute inset-x-4 bottom-6 z-50 cursor-pointer select-none"
      onClick={handleAdvance}
    >
      <p className="font-[VT323] text-[#fbc02d] uppercase text-lg mb-1">
        {speakerName}
      </p>
      <p className="font-[Share_Tech_Mono] text-sm text-[#e0d6c2] leading-relaxed min-h-[3rem] whitespace-pre-wrap">
        {text.slice(0, displayedLen)}
        {!finished && <span className="animate-pulse">|</span>}
      </p>

      {finished && choices && choices.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {choices.map((c, i) => (
            <button
              key={i}
              className="pixel-btn-gray text-xs"
              disabled={c.disabled}
              onClick={(e) => {
                e.stopPropagation();
                c.action();
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {finished && !choices && (
        <p className="font-[Share_Tech_Mono] text-xs text-[#a09080] mt-2 animate-pulse text-center">
          [ Nhấn Space hoặc Click ]
        </p>
      )}
    </div>
  );
}
