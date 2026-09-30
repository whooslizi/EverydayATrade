import React, { useState } from 'react';
import audioManager from '../audio/AudioManager';
import useGameStore from '../store/useGameStore';
import { DialogueModal, Choice } from './DialogueModal';

interface DialogueLine {
  speaker: string;
  text: string;
}

const PRISON_DIALOGUES: DialogueLine[][] = [
  [
    {
      speaker: 'Quan "To Lai" (19t)',
      text: 'Tao bi bat vi do po, do ong xa roi bon xe dua nhau chay 140 tren quoc lo. Cong an chot chan, tao dam thang barrier. May man chua chet thoi.',
    },
    {
      speaker: 'Quan "To Lai"',
      text: 'Gio an 2 nam. Ong ba o que ban con bo de dong tien boi thuong xe cong an. Tao hoi han nhung ma biet lam gi bay gio.',
    },
  ],
  [
    {
      speaker: 'Hung "Phong Bat"',
      text: 'Tao la "coach" day crypto. Lam kenh YouTube, thue biet thu quay clip, hua lai 30% moi thang. Cuoi cung tien cua nguoi ta tao xai het.',
    },
    {
      speaker: 'Hung "Phong Bat"',
      text: 'Vay muon ca ti bac de duy tri hinh anh giau sang. Khi no chong chat, tao chay. Cong an bat o bien gioi, bi khoi to lua dao chiem doat tai san.',
    },
  ],
  [
    {
      speaker: 'Co Dat Dau Co',
      text: 'Toi mua dat nong nghiep, lam gia so do roi ban lai gap 5 lan. Moi nguoi tin vi toi mac vest, di xe hoi, noi chuyen co ve tri thuc.',
    },
    {
      speaker: 'Co Dat Dau Co',
      text: 'Khi mot nguoi mua phat hien so do gia va to cao, ca chuoi lua dao bi pha. 47 nan nhan, tong so tien chiem doat hon 12 ti.',
    },
  ],
  [
    {
      speaker: 'Tom',
      text: 'Ey Khoa! May ngoi do ma khong biet xuong nuoc a? O day tao la lon. May muon yen thi phai nghe loi tao.',
    },
    {
      speaker: 'Khoa',
      text: 'Tao vao day vi tao ngu, khong phai vi tao so may. May muon uy hiep thi cu thu.',
    },
    {
      speaker: 'Tom',
      text: 'Ha! Cung dau nhi. Duoc roi, tao thich thang cung. Nhung nho, o trong nay khong co ai bao ve may dau.',
    },
    {
      speaker: 'Khoa',
      text: 'Tao cung khong can ai bao ve. Tao chi can lam dung nhung gi tao biet la dung.',
    },
    {
      speaker: 'Tom',
      text: 'May noi hay lam. Nhung o trong nay, "dung" voi "sai" no khac ngoai kia. May se hieu som thoi.',
    },
  ],
  [
    {
      speaker: 'Khoa (Ban)',
      text: 'Tao biet Tom khong phai nguoi xau. Han chi la mot thang bi cuoc doi day vao chan tuong roi chon cach sai de ton tai.',
    },
    {
      speaker: 'Khoa (Ban)',
      text: 'Nhung Khoa thi khac. Han co the ngu, co the sai, nhung han khong bao gio bo cuoc. Va tao tin dieu do.',
    },
  ],
  [
    {
      speaker: 'Tieng Ong Dao (trong dem)',
      text: 'Con oi, doi no khong cho ai nhieu co hoi dau. Nhung moi lan duoc cho, phai nam lay that chat. Dung de no truot khoi tay lan nua.',
    },
    {
      speaker: 'Tieng Ong Dao',
      text: 'Ong khong biet con dang o dau, nhung ong tin con se tim duoc duong ve. Goc dao nha minh van con do, cho con.',
    },
  ],
];

const JAIL_CHOICES: Choice[] = [
  { label: 'CHỊU ÁN PHẠT', value: 'INTERVENE' },
  { label: 'NGỦ QUA ĐÊM', value: 'SLEEP' },
  { label: 'VƯỢT NGỤC VỚI TÔM', value: 'ESCAPE' },
];

const JailCell: React.FC = () => {
  const resolveJail = useGameStore((s) => s.resolveJail);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  const currentDialogue = PRISON_DIALOGUES[dialogueIndex];
  const isLastDialogue = dialogueIndex >= PRISON_DIALOGUES.length - 1;

  const handleDialogueComplete = () => {
    if (isLastDialogue) {
      setShowChoices(true);
    } else {
      setDialogueIndex((prev) => prev + 1);
    }
  };

  const handleChoice = (choice: Choice) => {
    audioManager.playSfx('click');
    resolveJail();
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      <div
        className="absolute inset-0 bg-[#1e293b] bg-cover bg-center"
        style={{ backgroundImage: 'url(/backgrounds/jail_cell.png)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4">
        {!showChoices ? (
          <DialogueModal
            dialogues={currentDialogue.map((d) => ({
              speaker: d.speaker,
              text: d.text,
            }))}
            onComplete={handleDialogueComplete}
          />
        ) : (
          <DialogueModal
            dialogues={[
              {
                speaker: 'He thong',
                text: 'Dem xuong. May se lam gi?',
              },
            ]}
            choices={JAIL_CHOICES}
            onChoice={handleChoice}
            onComplete={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default JailCell;