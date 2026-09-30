import React from 'react';
import audioManager from '../audio/AudioManager';
import useGameStore from '../store/useGameStore';

const DisclaimerScreen: React.FC = () => {
  const setStage = useGameStore((s) => s.setStage);

  const handleAgree = () => {
    audioManager.playSfx('click');
    setStage('MEMORIAL');
  };

  const handleDisagree = () => {
    audioManager.playSfx('click');
    setStage('TITLE');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="pixel-panel max-w-[420px] w-full mx-4">
        <h2 className="font-[VT323] text-xl text-center text-[#78350f] mb-4">
          THÔNG BÁO MIỄN TRỪ TRÁCH NHIỆM
        </h2>

        <div className="font-[Share_Tech_Mono] text-xs text-gray-300 space-y-3 leading-relaxed">
          <p>
            Day la mot san pham giai tri co tinh chat chiem nghiem va trao phung xa hoi.
            Toan bo nhan vat, dia danh, su kien trong game deu la hu cau.
          </p>
          <p>
            Moi su trung hop voi nguoi that, viec that (neu co) deu la ngoai y muon.
            Game khong nham muc dich xuyen tac, boi nho bat ky ca nhan hay to chuc nao.
          </p>
          <p>
            Noi dung game co the chua yeu to bao luc nhe, ngon ngu duong pho,
            tinh huong nguoi lon. Khong phu hop voi tre em duoi 16 tuoi.
          </p>
          <p>
            Nguoi choi tu chiu trach nhiem ve quyet dinh cua minh trong game.
            Nha phat trien khong chiu trach nhiem ve bat ky hanh vi nao
            nguoi choi thuc hien ngoai doi thuc dua tren noi dung game.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 items-center">
          <button className="pixel-btn-green w-full" onClick={handleAgree}>
            TÔI ĐỒNG TÌNH
          </button>
          <button className="pixel-btn-red w-full" onClick={handleDisagree}>
            TÔI KHÔNG ĐỒNG TÌNH
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerScreen;
