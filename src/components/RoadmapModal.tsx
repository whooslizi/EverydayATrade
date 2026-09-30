import React from 'react';
import audioManager from '../audio/AudioManager';
import useGameStore from '../store/useGameStore';

interface RoadmapModalProps {
  onClose: () => void;
}

const ENDINGS = [
  { id: '1A', name: 'Tu Toi Dai Han' },
  { id: '1B', name: 'Bi Tom Lua Gat' },
  { id: '2', name: 'Chan Thanh Cuoi Phu Ba' },
  { id: '3', name: 'Canh Sat Chim So Gay' },
  { id: '4', name: 'Con Thinh No Ghe Nhua' },
  { id: '5', name: 'Dung Ban Dung Chu' },
  { id: '6', name: 'Loi Hen Duoi Goc Dao (True Ending)' },
];

const RoadmapModal: React.FC<RoadmapModalProps> = ({ onClose }) => {
  const endingsUnlocked = useGameStore((s) => s.endingsUnlocked);

  const handleClose = () => {
    audioManager.playSfx('click');
    onClose();
  };

  const isUnlocked = (id: string) => endingsUnlocked.includes(id);
  const hasAnyEnding = endingsUnlocked.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="pixel-panel max-w-[380px] w-full mx-4">
        <h2 className="font-[VT323] text-2xl text-center text-[#78350f] mb-4">
          LO TRINH CAU CHUYEN
        </h2>

        {!hasAnyEnding ? (
          <div className="space-y-3">
            <div className="pixel-panel-dark p-3">
              <p className="font-[VT323] text-lg text-gray-400">
                PROLOGUE (BỊ KHÓA)
              </p>
            </div>
            <div className="pixel-panel-dark p-3">
              <p className="font-[Share_Tech_Mono] text-sm text-gray-500">
                Ending 1: &lt;unknown&gt;
              </p>
            </div>
            <p className="font-[Share_Tech_Mono] text-xs text-center text-gray-500 mt-2">
              Hoan thanh mot ket thuc de mo khoa lo trinh.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="pixel-panel-dark p-3">
              <p className="font-[VT323] text-lg text-[#d97706]">
                PROLOGUE
              </p>
              <p className="font-[Share_Tech_Mono] text-xs text-gray-300 mt-1">
                Khoa roi que len Sai Gon, bat dau 30 ngay muu sinh.
              </p>
            </div>

            <div className="space-y-2">
              {ENDINGS.map((ending) => {
                const unlocked = isUnlocked(ending.id);
                return (
                  <div
                    key={ending.id}
                    className={`pixel-panel-dark p-2 flex items-center gap-2 ${
                      unlocked ? '' : 'opacity-60'
                    }`}
                  >
                    <span
                      className={`font-[VT323] text-sm w-8 text-center ${
                        unlocked ? 'text-[#d97706]' : 'text-gray-500'
                      }`}
                    >
                      {ending.id}
                    </span>
                    <span
                      className={`font-[Share_Tech_Mono] text-xs flex-1 ${
                        unlocked ? 'text-gray-200' : 'text-gray-500'
                      }`}
                    >
                      {unlocked ? ending.name : '???'}
                    </span>
                    {unlocked && (
                      <span className="font-[VT323] text-xs text-green-400">
                        [OK]
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button className="pixel-btn-gray" onClick={handleClose}>
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapModal;
