export type GameStage = 'DISCLAIMER' | 'TITLE' | 'INTRO_DIALOGUE' | 'MORNING_PHASE' | 'JOB_SELECT' | 'WORKING' | 'SELLING' | 'NIGHT_SETTLEMENT' | 'JAIL_CELL' | 'WEDDING_CUTSCENE' | 'ENDING' | 'GAME_OVER' | 'DISCLAIMER_POST_GAME' | 'MEMORIAL';
export type EndingId = 'ENDING_1A' | 'ENDING_1B' | 'ENDING_2' | 'ENDING_3' | 'ENDING_4' | 'ENDING_5' | 'ENDING_6';
export type JobId = 'REPAIR' | 'FOOD' | 'MECHANIC' | 'CODER';
export type PricingTier = 'BINH_DAN' | 'HOP_LY' | 'CHAT_CHEM';
export type JailChoice = 'INTERVENE' | 'SLEEP' | 'ESCAPE' | null;
export type TrackId = 'TRACK_1' | 'TRACK_2' | 'TRACK_3';

export interface Vec2 { x: number; y: number; }

export interface JobItem {
  id: string;
  name: string;
  ingredientCost: number;
  basePrice: number;
  craftTimeMs: number;
}

export interface Job {
  id: JobId;
  name: string;
  description: string;
  flavorText: string;
  baseCost: number;
  baseRevenue: number;
  items: JobItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  cost: number;
  hungerRestore: number;
  energyRestore: number;
  forDog?: boolean;
}

export interface InventorySlot {
  itemId: string;
  rawQty: number;
  craftedQty: number;
}

export interface EndingData {
  id: EndingId;
  title: string;
  subtitle: string;
  story: string[];
  mood: 'tragic' | 'bittersweet' | 'comedic' | 'triumphant';
}

export interface GameState {
  stage: GameStage;
  isSoundOn: boolean;
  currentTrack: TrackId;
  day: number;
  maxDays: number;
  cash: number;
  debt: number;
  dailyInterest: number;
  playerHunger: number;
  playerEnergy: number;
  dog: {
    hunger: number;
    loyalty: number;
    isKidnapped: boolean;
  };
  taxSuspicion: number;
  mobAnger: number;
  inventory: InventorySlot[];
  currentJob: Job | null;
  selectedPricing: PricingTier;
  craftQueue: number;
  soldToday: number;
  revenueTodayGross: number;
  dialogueIndex: number;
  log: string[];
  timesArrested: number;
  jailNightsRemaining: number;
  jailChoice: JailChoice;
  totalHonestDays: number;
  totalCheatingDays: number;
  weddingAttended: boolean;
  nguyenGiftReceived: boolean;
  endingId: EndingId | null;
  nightVoiceShown: boolean;
  isFugitive: boolean;
  isWanted: boolean;
  belowCostDays: number;
  miniGameActive: boolean;
  miniGameTarget: number;
  miniGameScore: number;

  acceptDisclaimer: () => void;
  resetGame: () => void;
  startGame: () => void;
  advanceDialogue: () => void;
  selectJob: (job: Job) => void;
  buyIngredients: (itemId: string, qty: number, costPer: number) => void;
  startCraft: (itemId: string) => void;
  finishCraft: (itemId: string) => void;
  sellBatch: (count: number, revenue: number) => void;
  buyFood: (cost: number, h: number, e: number, dog: boolean, n: string) => void;
  depleteEnergy: (amt: number) => void;
  payDebt: (amt: number) => void;
  addCash: (amt: number) => void;
  removeCash: (amt: number) => void;
  addSuspicion: (amt: number) => void;
  addMobAnger: (amt: number) => void;
  triggerArrest: () => void;
  setJailChoice: (c: JailChoice) => void;
  resolveJail: () => void;
  endDay: () => void;
  attendWedding: (giftAmount: number) => void;
  receiveNguyenGift: () => void;
  triggerEnding: (id: EndingId) => void;
  setMiniGame: (a: boolean, t?: number) => void;
  addMiniGameScore: (pts: number) => void;
  toggleSound: () => void;
  addLog: (msg: string) => void;
  setNightVoiceShown: (s: boolean) => void;
  markBelowCostDay: () => void;
  setDogKidnapped: (k: boolean) => void;
  ransomDog: () => void;
  setStage: (s: GameStage) => void;
  setPricing: (p: PricingTier) => void;
  setTrack: (t: TrackId) => void;
}
