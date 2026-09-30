import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Job, PricingTier, JailChoice } from '../types';

const initialState: Omit<GameState, 'acceptDisclaimer' | 'resetGame' | 'startGame' | 'advanceDialogue' | 'selectJob' | 'buyIngredients' | 'startCraft' | 'finishCraft' | 'sellBatch' | 'buyFood' | 'depleteEnergy' | 'payDebt' | 'addCash' | 'removeCash' | 'addSuspicion' | 'addMobAnger' | 'triggerArrest' | 'setJailChoice' | 'resolveJail' | 'endDay' | 'attendWedding' | 'receiveNguyenGift' | 'triggerEnding' | 'setMiniGame' | 'addMiniGameScore' | 'toggleSound' | 'addLog' | 'setNightVoiceShown' | 'markBelowCostDay' | 'setDogKidnapped' | 'ransomDog' | 'setStage' | 'setPricing' | 'setTrack' | 'sellDog' | 'buyDogBack'> = {
  stage: 'TITLE',
  isSoundOn: true,
  currentTrack: 'TRACK_1',
  day: 1,
  maxDays: 14,
  cash: 100000,
  debt: 20000000,
  dailyInterest: 50000,
  playerHunger: 100,
  playerEnergy: 100,
  dog: {
    hunger: 50,
    loyalty: 50,
    isKidnapped: false,
  },
  taxSuspicion: 0,
  mobAnger: 0,
  inventory: [],
  currentJob: null,
  selectedPricing: 'BINH_DAN',
  craftQueue: 0,
  soldToday: 0,
  revenueTodayGross: 0,
  dialogueIndex: 0,
  log: [],
  endingsUnlocked: [],
  timesArrested: 0,
  jailNightsRemaining: 0,
  jailChoice: null,
  totalHonestDays: 0,
  totalCheatingDays: 0,
  weddingAttended: false,
  nguyenGiftReceived: false,
  endingId: null,
  nightVoiceShown: false,
  isFugitive: false,
  isWanted: false, soldDog: false,
  belowCostDays: 0,
  miniGameActive: false,
  miniGameTarget: 100,
  miniGameScore: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setStage: (s) => set({ stage: s }),
      setPricing: (p) => set({ selectedPricing: p }),
      setTrack: (t) => set({ currentTrack: t }),
      acceptDisclaimer: () => set({ stage: 'TITLE' }),
      resetGame: () => set({ stage: 'TITLE' }), // Keep money and progress
      startGame: () => {
        if (get().endingsUnlocked.length > 0 || get().day > 1) {
          set({ stage: 'MORNING_PHASE' });
        } else {
          set({ stage: 'INTRO_DIALOGUE', dialogueIndex: 0 });
        }
      },
      advanceDialogue: () => {
        set((state) => {
          if (state.dialogueIndex >= 11) {
            return { stage: 'MORNING_PHASE', dialogueIndex: 0 };
          }
          return { dialogueIndex: state.dialogueIndex + 1 };
        });
      },
      selectJob: (job) => {
        set({
          currentJob: job,
          stage: 'WORKING',
          inventory: job.items.map((i) => ({ itemId: i.id, rawQty: 0, craftedQty: 0 })),
          selectedPricing: 'BINH_DAN',
          craftQueue: 0,
          soldToday: 0,
          revenueTodayGross: 0,
        });
      },
      buyIngredients: (itemId, qty, costPer) => {
        const { cash, inventory, log } = get();
        const totalCost = costPer * qty;
        if (cash < totalCost) return;
        set({
          cash: cash - totalCost,
          inventory: inventory.map((inv) =>
            inv.itemId === itemId ? { ...inv, rawQty: inv.rawQty + qty } : inv
          ),
          log: [...log, `Mua nguyen lieu: -${totalCost.toLocaleString('vi-VN')}d`],
        });
      },
      startCraft: (itemId) => {
        const { inventory } = get();
        const inv = inventory.find((i) => i.itemId === itemId);
        if (!inv || inv.rawQty <= 0) return;
        set({
          inventory: inventory.map((i) =>
            i.itemId === itemId ? { ...i, rawQty: i.rawQty - 1 } : i
          ),
        });
      },
      finishCraft: (itemId) => {
        const { inventory, playerEnergy } = get();
        set({
          inventory: inventory.map((i) =>
            i.itemId === itemId ? { ...i, craftedQty: i.craftedQty + 1 } : i
          ),
          playerEnergy: Math.max(0, playerEnergy - 5),
        });
      },
      sellBatch: (count, revenue) => {
        const { cash, soldToday, revenueTodayGross } = get();
        set({
          cash: cash + revenue,
          soldToday: soldToday + count,
          revenueTodayGross: revenueTodayGross + revenue,
        });
      },
      buyFood: (cost, hungerRestore, energyRestore, forDog, name) => {
        const { cash, dog, playerHunger, playerEnergy, log } = get();
        if (cash < cost) return;
        if (forDog) {
          set({
            cash: cash - cost,
            dog: { ...dog, hunger: Math.min(100, dog.hunger + hungerRestore), loyalty: Math.min(100, dog.loyalty + 10) },
            log: [...log, `Cho Dung an: -${cost.toLocaleString('vi-VN')}d`],
          });
        } else {
          set({
            cash: cash - cost,
            playerHunger: Math.min(100, playerHunger + hungerRestore),
            playerEnergy: Math.min(100, playerEnergy + energyRestore),
            log: [...log, `An ${name}: -${cost.toLocaleString('vi-VN')}d`],
          });
        }
      },
      depleteEnergy: (amount) => set({ playerEnergy: Math.max(0, get().playerEnergy - amount) }),
      payDebt: (amount) => {
        const { cash, debt, log } = get();
        const payment = Math.min(amount, cash, debt);
        if (payment <= 0) return;
        set({ cash: cash - payment, debt: debt - payment, log: [...log, `Tra no: -${payment.toLocaleString('vi-VN')}d`] });
      },
      addCash: (amount) => set({ cash: get().cash + amount }),
      removeCash: (amount) => set({ cash: Math.max(0, get().cash - amount) }),
      addSuspicion: (amount) => set({ taxSuspicion: Math.min(100, get().taxSuspicion + amount) }),
      addMobAnger: (amount) => set({ mobAnger: Math.min(100, get().mobAnger + amount) }),
      triggerArrest: () => set({ timesArrested: get().timesArrested + 1, stage: 'JAIL_CELL', jailNightsRemaining: 1, jailChoice: null, log: [...get().log, 'Bi bat!'] }),
      setJailChoice: (choice) => set({ jailChoice: choice }),
      resolveJail: () => {
        const state = get();
        if (state.jailChoice === 'ESCAPE') {
          set({ stage: 'MORNING_PHASE', jailNightsRemaining: 0, isWanted: true, log: [...state.log, 'Vuot nguc: Dong pham lua ban, an giam them.'] });
        } else if (state.jailChoice === 'INTERVENE') {
          set({ playerEnergy: Math.max(0, state.playerEnergy - 30), stage: 'MORNING_PHASE', jailChoice: null, log: [...state.log, 'Ban be gãy mưu Tôm. Sang hom sau, Tra bao lanh.'] });
        } else {
          set({ stage: 'MORNING_PHASE', cash: 0, log: [...state.log, 'Ngu qua dem, tien mat het.'] });
        }
      },
      endDay: () => {
        const state = get();
        const nextDay = state.day + 1;
        if (state.cash < 0) { set({ stage: 'GAME_OVER', log: [...state.log, 'Am tien!'] }); return; }
        if (nextDay > state.maxDays && state.debt > 0) { set({ stage: 'GAME_OVER', log: [...state.log, 'Het han!'] }); return; }
        const isWeddingDay = nextDay === 7 && !state.weddingAttended;
        set({
          day: nextDay,
          debt: state.debt + state.dailyInterest,
          playerHunger: Math.max(0, state.playerHunger - 20),
          playerEnergy: Math.min(100, state.playerEnergy + 30),
          dog: { ...state.dog, hunger: Math.max(0, state.dog.hunger - 15) },
          currentJob: null, selectedPricing: 'BINH_DAN', inventory: [], craftQueue: 0, soldToday: 0, revenueTodayGross: 0,
          totalHonestDays: state.totalHonestDays + (state.selectedPricing === 'BINH_DAN' ? 1 : 0),
          totalCheatingDays: state.totalCheatingDays + (state.selectedPricing === 'BINH_DAN' ? 0 : 1),
          nightVoiceShown: false,
          stage: isWeddingDay ? 'WEDDING_CUTSCENE' : 'MORNING_PHASE',
          log: [`Ngay ${nextDay}`],
        });
      },
      attendWedding: (giftAmount) => set({ weddingAttended: true, cash: Math.max(0, get().cash - giftAmount), log: [...get().log, `Mung cuoi: -${giftAmount}d`] }),
      receiveNguyenGift: () => set({ nguyenGiftReceived: true, cash: get().cash + 300000, log: [...get().log, 'Nguyen gui tang: +300k'] }),
      triggerEnding: (endingId) => set({ stage: 'ENDING', endingId }),
      setMiniGame: (active, t = 100) => set({ miniGameActive: active, miniGameTarget: t, miniGameScore: 0 }),
      addMiniGameScore: (pts) => set({ miniGameScore: get().miniGameScore + pts }),
      toggleSound: () => set({ isSoundOn: !get().isSoundOn }),
      addLog: (msg) => set({ log: [...get().log, msg] }),
      setNightVoiceShown: (shown) => set({ nightVoiceShown: shown }),
      markBelowCostDay: () => set({ belowCostDays: get().belowCostDays + 1 }),
      setDogKidnapped: (k) => set({ dog: { ...get().dog, isKidnapped: k } }),
      sellDog: () => { set({ cash: get().cash + 363636, soldDog: true, stage: 'WASTED', endingId: 'ENDING_7_SOLD_DOG', log: [...get().log, "Ban cho Dung: +363,636d"] }); },
      buyDogBack: () => { set({ cash: get().cash - 1000000, soldDog: false, log: [...get().log, "Chuoc lai Dung: -1,000,000d"] }); },
      ransomDog: () => {
        if (get().cash >= 30000) set({ cash: get().cash - 30000, dog: { ...get().dog, isKidnapped: false, loyalty: Math.max(0, get().dog.loyalty - 10) } });
      },
    }),
    { name: 'mnmn-save-state' }
  )
);
