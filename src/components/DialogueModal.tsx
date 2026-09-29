import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../audio/AudioManager';

export interface Choice {
  label: string;
  action: () => void;
}

interface Props {
  speakerId: string;
  speakerName: string;
  text: string;
  choices?: Choice[];
  onComplete?: () => void;
}

export function DialogueModal({ speakerId, speakerName, text, choices, onComplete }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const textRef = useRef('');

  useEffect(() => {
    setDisplayedText('');
    textRef.current = '';
    setIsTyping(true);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        textRef.current += text[i];
        setDisplayedText(textRef.current);
        if (i % 2 === 0) audioManager.playBlipSFX();
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  const handleSkip = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
    } else if (onComplete && (!choices || choices.length === 0)) {
      onComplete();
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-50 animate-fade-in-up" onClick={handleSkip}>
      <div className="border-4 border-[#3c2415] bg-[#1c1917]/95 p-3 flex gap-4 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] cursor-pointer">
        <div className="w-16 h-16 shrink-0 border-2 border-[#3c2415] bg-[#292524] flex items-center justify-center overflow-hidden">
          <img
            src={`/sprites/portraits/${speakerId}.png`}
            alt={speakerName}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-h-[64px]">
          <div className="text-[#facc15] font-pixel text-xl mb-1">{speakerName}</div>
          <div className="text-white font-pixel text-lg leading-snug whitespace-pre-wrap">{displayedText}</div>
          
          {!isTyping && choices && choices.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {choices.map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); audioManager.playBlipSFX(); c.action(); }}
                  className="text-left bg-[#3c2415] text-[#fde68a] border-2 border-[#d4a637] p-2 font-pixel text-base hover:bg-[#d4a637] hover:text-[#3c2415] transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          
          {!isTyping && (!choices || choices.length === 0) && (
            <div className="mt-auto self-end animate-pixel-blink text-[#facc15] font-pixel text-sm">
              [ Ke tiep ]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
