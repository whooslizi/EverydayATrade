
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

export function DialogueModal({ speakerId, speakerName, text, onComplete, choices }: Props) {
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

  const portraitMap: Record<string, string> = {
    'tra': '/sprites/portraits/tra.png',
    'tom': '/sprites/portraits/tom.png',
    'sv_bachkhoa': '/sprites/portraits/sinhvien.png',
    'ha': '/sprites/portraits/ha.png',
    'hoang_it': '/sprites/portraits/hoang_it.png',
    'ongdao': '/sprites/portraits/ongdao.png',
    'hero': '/sprites/portraits/hero.png'
  };
  
  const avatarUrl = speakerId ? portraitMap[speakerId.toLowerCase()] : null;

  return (
    <div className="bg-[#fef3c7] border-4 border-[#78350f] p-3 flex gap-3 items-start shadow-inner w-full h-full relative" onClick={() => { if(!choices || choices.length===0) onComplete?.(); }}>
      {/* 64x64 Portrait */}
      <div className="w-[64px] h-[64px] bg-[#d97706] border-2 border-[#78350f] flex-shrink-0 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={speakerName} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
        ) : (
          <div className="text-[#fef3c7] font-[VT323] text-2xl text-center leading-none">
            {speakerId ? speakerId.charAt(0).toUpperCase() : '?'}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col h-full">
        <h3 className="text-[#d97706] font-bold text-xl font-[VT323] uppercase tracking-wide leading-none mb-1">{speakerName}</h3>
        <div className="flex-1 overflow-y-auto pr-1">
          <p className="text-[#1c1917] text-[15px] font-[Share_Tech_Mono] leading-tight min-h-[40px] whitespace-pre-wrap">{displayed}</p>
          
          {isDone && choices && choices.length > 0 && (
            <div className="mt-2 flex flex-col gap-1.5">
              {choices.map((c, idx) => (
                <button 
                  key={idx} 
                  disabled={c.disabled}
                  onClick={(e) => { e.stopPropagation(); c.action(); }} 
                  className="bg-[#e6d5a7] hover:bg-[#d4c395] text-[#1c1917] font-[Share_Tech_Mono] text-left px-2 py-1 border border-[#78350f] text-[15px] disabled:opacity-50"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {isDone && (!choices || choices.length === 0) && (
          <div className="text-right text-[#991b1b] text-[15px] font-[Share_Tech_Mono] animate-pulse mt-1 shrink-0">
            [ Nhấn Click ]
          </div>
        )}
      </div>
    </div>
  );
}
