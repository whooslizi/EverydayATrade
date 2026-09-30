import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { audioManager } from '../audio/AudioManager';
import { formatVND, JOBS, PRICING_OPTIONS } from '../data/gameData';
import { getScenario, pickScenarioIndex } from '../data/scenarios';
import { PhoneScamModal } from './PhoneScamModal';
import { StallViewport } from './StallViewport';
import { RetroBackground } from './RetroBackground';
import type { JobItem } from '../types';

/* ------------------------------------------------------------------ */
/* Tuning                                                              */
/* ------------------------------------------------------------------ */

const SLOT_COUNT = 2;
const SHIFT_SECONDS = 60;
const STOP_SPAWN_AT_SECONDS = 4;
const FIRST_SPAWN_MS = 1200;
const SPAWN_MIN_MS = 1500;
const SPAWN_MAX_MS = 3500;
const PATIENCE_MS = 15000;
const ANGRY_HOLD_MS = 1800;
const REPLY_WINDOW_MS = 8000;
const COMEBACK_MS = 2500;
const DONE_BURN_MS = 5000;
const DEFAULT_CRAFT_MS = 4000;
const SHIFT_END_DELAY_MS = 1200;
const COMMIT_INTERVAL_MS = 50;
const MAX_FRAME_DT_MS = 100;

/* Text treatments. Light text on dark panels gets the black arcade shadow,
   dark text on the cream panels gets a soft embossed shadow. */
const FONT_DISPLAY = "font-['VT323']";
const FONT_BODY = "font-['Share_Tech_Mono']";
const SHADOW_ON_DARK = 'drop-shadow-[2px_2px_0px_#000]';
const SHADOW_ON_LIGHT = 'drop-shadow-[1px_1px_0px_rgba(120,53,15,0.35)]';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type SlotState = 'idle' | 'cooking' | 'done' | 'burnt';
type CustomerPhase = 'waiting' | 'happy' | 'angry' | 'replying';
type TrayTab = 'ITEMS' | 'PRICING' | 'DEBT' | 'LOG';

interface CookingSlot {
  id: number;
  itemId: string | null;
  progress: number;
  state: SlotState;
  timer: number;
}

interface CustomerView {
  active: boolean;
  patience: number;
  order: string | null;
  state: CustomerPhase;
  scenarioIdx: number;
}

/** Mutable simulation state. Lives in one stable object, never read through a render closure. */
interface Sim {
  slots: CookingSlot[];
  customer: CustomerView;
  shiftActive: boolean;
  shiftTime: number;
  nextSpawnMs: number;
  angerHoldMs: number;
  replyWindowMs: number;
  comeback: string | null;
  comebackMs: number;
  endDelayMs: number | null;
  lastScenario: number;
  finished: boolean;
}

/** Immutable snapshot handed to React. */
interface View {
  slots: CookingSlot[];
  customer: CustomerView;
  shiftActive: boolean;
  shiftTime: number;
  comeback: string | null;
}

/* ------------------------------------------------------------------ */
/* Simulation helpers                                                  */
/* ------------------------------------------------------------------ */

const gs = () => useGameStore.getState();

const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);

const idleCustomer = (): CustomerView => ({
  active: false,
  patience: PATIENCE_MS,
  order: null,
  state: 'waiting',
  scenarioIdx: 0,
});

const createSlots = (): CookingSlot[] =>
  Array.from({ length: SLOT_COUNT }, (_, id): CookingSlot => ({
    id,
    itemId: null,
    progress: 0,
    state: 'idle',
    timer: 0,
  }));

const createSim = (): Sim => ({
  slots: createSlots(),
  customer: idleCustomer(),
  shiftActive: false,
  shiftTime: SHIFT_SECONDS,
  nextSpawnMs: FIRST_SPAWN_MS,
  angerHoldMs: 0,
  replyWindowMs: 0,
  comeback: null,
  comebackMs: 0,
  endDelayMs: null,
  lastScenario: -1,
  finished: false,
});

const snapshot = (sim: Sim): View => ({
  slots: sim.slots.map((s) => ({ ...s })),
  customer: { ...sim.customer },
  shiftActive: sim.shiftActive,
  shiftTime: sim.shiftTime,
  comeback: sim.comeback,
});

const clearCustomer = (sim: Sim): void => {
  sim.customer = idleCustomer();
  sim.comeback = null;
  sim.comebackMs = 0;
  sim.replyWindowMs = 0;
  sim.angerHoldMs = 0;
  sim.nextSpawnMs = randomBetween(SPAWN_MIN_MS, SPAWN_MAX_MS);
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function SingleFrameHUD() {
  const day = useGameStore((s) => s.day);
  const maxDays = useGameStore((s) => s.maxDays);
  const cash = useGameStore((s) => s.cash);
  const debt = useGameStore((s) => s.debt);
  const isSoundOn = useGameStore((s) => s.isSoundOn);
  const inventory = useGameStore((s) => s.inventory);
  const selectedPricing = useGameStore((s) => s.selectedPricing);
  const currentJob = useGameStore((s) => s.currentJob);
  const taxSuspicion = useGameStore((s) => s.taxSuspicion);
  const mobAnger = useGameStore((s) => s.mobAnger);
  const log = useGameStore((s) => s.log);

  const [activeTab, setActiveTab] = useState<TrayTab>('ITEMS');
  const [showPhone, setShowPhone] = useState(false);
  const [phoneRinging, setPhoneRinging] = useState(false);

  const [sim] = useState<Sim>(createSim);
  const [view, setView] = useState<View>(() => snapshot(sim));
  const flush = useCallback(() => setView(snapshot(sim)), [sim]);

  const job = currentJob ?? JOBS[0];
  const items: readonly JobItem[] = job.items ?? [];
  const currentPricing = PRICING_OPTIONS.find((p) => p.tier === selectedPricing) ?? PRICING_OPTIONS[0];

  const itemsRef = useRef<readonly JobItem[]>(items);
  itemsRef.current = items;
  const showPhoneRef = useRef(showPhone);
  showPhoneRef.current = showPhone;

  /* Game loop. Reads only `sim` and `itemsRef`, so nothing can go stale. */
  useEffect(() => {
    let frameId = 0;
    let last = performance.now();
    let lastCommit = 0;
    let pending = false;

    const loop = (now: number) => {
      const dt = Math.min(now - last, MAX_FRAME_DT_MS);
      last = now;
      let dirty = false;

      /* Cooking slots */
      for (const slot of sim.slots) {
        if (slot.state === 'cooking') {
          slot.timer += dt;
          const target = itemsRef.current.find((i) => i.id === slot.itemId)?.craftTimeMs ?? DEFAULT_CRAFT_MS;
          if (slot.timer >= target) {
            slot.progress = 100;
            slot.state = 'done';
            slot.timer = 0;
          } else {
            slot.progress = (slot.timer / target) * 100;
          }
          dirty = true;
        } else if (slot.state === 'done') {
          slot.timer += dt;
          if (slot.timer >= DONE_BURN_MS) {
            slot.state = 'burnt';
            slot.timer = 0;
            dirty = true;
          }
        }
      }

      /* Shift clock */
      if (sim.shiftActive) {
        const before = Math.ceil(sim.shiftTime);
        sim.shiftTime = Math.max(0, sim.shiftTime - dt / 1000);
        if (Math.ceil(sim.shiftTime) !== before) dirty = true;
        if (sim.shiftTime <= 0) {
          sim.shiftActive = false;
          sim.customer = idleCustomer();
          sim.comeback = null;
          sim.endDelayMs = SHIFT_END_DELAY_MS;
          dirty = true;
        }
      }

      if (sim.endDelayMs !== null) {
        sim.endDelayMs -= dt;
        if (sim.endDelayMs <= 0) {
          sim.endDelayMs = null;
          sim.finished = true;
          gs().setStage('NIGHT_SETTLEMENT');
        }
      }

      /* Customer lifecycle */
      if (sim.shiftActive) {
        const c = sim.customer;
        if (c.active) {
          if (c.state === 'waiting') {
            c.patience -= dt;
            dirty = true;
            if (c.patience <= 0) {
              c.patience = 0;
              c.state = 'angry';
              sim.angerHoldMs = ANGRY_HOLD_MS;
              gs().addMobAnger(10);
              audioManager.playErrorSFX();
            }
          } else if (c.state === 'angry') {
            sim.angerHoldMs -= dt;
            if (sim.angerHoldMs <= 0) {
              clearCustomer(sim);
              dirty = true;
            }
          } else if (c.state === 'replying') {
            if (sim.comeback !== null) {
              sim.comebackMs -= dt;
              if (sim.comebackMs <= 0) {
                clearCustomer(sim);
                dirty = true;
              }
            } else {
              sim.replyWindowMs -= dt;
              if (sim.replyWindowMs <= 0) {
                clearCustomer(sim);
                dirty = true;
              }
            }
          }
        } else {
          sim.nextSpawnMs -= dt;
          const pool = itemsRef.current;
          if (sim.nextSpawnMs <= 0 && sim.shiftTime > STOP_SPAWN_AT_SECONDS && pool.length > 0) {
            const order = pool[Math.floor(Math.random() * pool.length)].id;
            sim.customer = { active: true, patience: PATIENCE_MS, order, state: 'waiting', scenarioIdx: 0 };
            dirty = true;
          }
        }
      }

      /* Throttled commit: React sees at most ~20 updates per second */
      if (dirty) pending = true;
      if (pending && now - lastCommit >= COMMIT_INTERVAL_MS) {
        pending = false;
        lastCommit = now;
        flush();
      }

      if (!sim.finished) frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [sim, flush]);

  /* Random phone call, once per mount */
  useEffect(() => {
    let ringTimeout: ReturnType<typeof setTimeout> | undefined;
    const trigger = setTimeout(() => {
      if (Math.random() < 0.3 && !showPhoneRef.current) {
        setPhoneRinging(true);
        audioManager.playBlipSFX();
        ringTimeout = setTimeout(() => setPhoneRinging(false), 5000);
      }
    }, 15000);
    return () => {
      clearTimeout(trigger);
      if (ringTimeout !== undefined) clearTimeout(ringTimeout);
    };
  }, []);

  /* ---------------------------- Actions ---------------------------- */

  const startShift = useCallback(() => {
    if (sim.shiftActive || sim.finished || sim.shiftTime <= 0) return;
    audioManager.playBlipSFX();
    sim.shiftActive = true;
    sim.nextSpawnMs = FIRST_SPAWN_MS;
    flush();
  }, [sim, flush]);

  const handleStartCook = useCallback(
    (item: JobItem) => {
      const entry = gs().inventory.find((i) => i.itemId === item.id);
      if (!entry || entry.rawQty <= 0) {
        audioManager.playErrorSFX();
        return;
      }
      const target = sim.slots.find((s) => s.state === 'idle' || s.state === 'burnt');
      if (!target) {
        audioManager.playErrorSFX();
        return;
      }
      audioManager.playBlipSFX();
      gs().startCraft(item.id);
      target.itemId = item.id;
      target.progress = 0;
      target.state = 'cooking';
      target.timer = 0;
      flush();
    },
    [sim, flush],
  );

  const deliverFood = useCallback(
    (slotIdx: number) => {
      const slot = sim.slots[slotIdx];
      if (!slot || slot.state !== 'done') return;

      const c = sim.customer;
      if (sim.shiftActive && c.active && c.state === 'waiting' && c.order === slot.itemId) {
        const state = gs();
        const pricing = PRICING_OPTIONS.find((p) => p.tier === state.selectedPricing) ?? PRICING_OPTIONS[0];
        const itemDef = itemsRef.current.find((i) => i.id === slot.itemId);
        audioManager.playCoinSFX();
        state.sellBatch(1, (itemDef?.basePrice ?? 0) * pricing.marginMultiplier);
        state.addMobAnger(pricing.angerIncrease);

        const idx = pickScenarioIndex(pricing.tier, sim.lastScenario);
        sim.lastScenario = idx;
        c.state = 'replying';
        c.scenarioIdx = idx;
        sim.comeback = null;
        sim.replyWindowMs = REPLY_WINDOW_MS;
      } else {
        audioManager.playErrorSFX();
      }

      slot.itemId = null;
      slot.progress = 0;
      slot.state = 'idle';
      slot.timer = 0;
      flush();
    },
    [sim, flush],
  );

  const handleReply = useCallback(
    (choiceIdx: number) => {
      const c = sim.customer;
      if (!c.active || c.state !== 'replying' || sim.comeback !== null) return;
      const choice = getScenario(c.scenarioIdx).choices[choiceIdx];
      if (!choice) return;
      audioManager.playBlipSFX();
      if (choice.angerDelta !== 0) gs().addMobAnger(choice.angerDelta);
      sim.comeback = choice.comeback;
      sim.comebackMs = COMEBACK_MS;
      flush();
    },
    [sim, flush],
  );

  /* ---------------------------- Render ----------------------------- */

  const renderHUD = () => (
    <div className="h-[52px] bg-[#1a0e08] border-b-4 border-[#3f2010] flex items-center justify-between px-2 shrink-0 shadow-md relative z-10">
      <div className={`${FONT_DISPLAY} text-[#facc15] text-[20px] leading-tight ${SHADOW_ON_DARK}`}>
        <div>Ngày {day}/{maxDays}</div>
        <div className="text-[#fef3c7]">Ca: {Math.ceil(view.shiftTime)}s</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className={`${FONT_DISPLAY} text-[#34d399] text-[20px] leading-tight ${SHADOW_ON_DARK}`}>
          Ví: {formatVND(cash)}
        </div>
        <div className={`${FONT_DISPLAY} text-[#ef4444] text-[16px] leading-tight ${SHADOW_ON_DARK}`}>
          Nợ: {formatVND(debt)}
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => gs().toggleSound()}
          className={`bg-[#3f2010] px-2 py-1 text-[#fef3c7] ${FONT_DISPLAY} text-[16px] border-2 border-[#78350f] ${SHADOW_ON_DARK}`}
        >
          {isSoundOn ? 'ÂM THANH' : 'TẮT ÂM'}
        </button>
        <button
          onClick={() => gs().setStage('TITLE')}
          className={`bg-[#991b1b] px-2 py-1 text-white ${FONT_DISPLAY} text-[16px] border-2 border-[#450a0a] ${SHADOW_ON_DARK}`}
        >
          THOÁT
        </button>
      </div>
    </div>
  );

  const tabLabels: Record<TrayTab, string> = {
    ITEMS: 'NGUYÊN LIỆU',
    PRICING: 'ĐỊNH GIÁ',
    DEBT: 'SỔ NỢ',
    LOG: 'NHẬT KÝ',
  };

  const renderTray = () => (
    <div className="h-[34%] bg-[#fef3c7] flex flex-col shrink-0 border-t-4 border-[#78350f] relative z-10">
      <div className="flex bg-[#3f2010] px-2 pt-1 gap-1 shrink-0 shadow-inner">
        {(Object.keys(tabLabels) as TrayTab[]).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                audioManager.playBlipSFX();
                setActiveTab(tab);
              }}
              className={`flex-1 rounded-t-md ${FONT_DISPLAY} text-[16px] border-x-2 border-t-2 ${
                active
                  ? `bg-[#fef3c7] text-[#78350f] border-[#78350f] pt-1 ${SHADOW_ON_LIGHT}`
                  : `bg-[#23150d] text-[#fef3c7] border-[#451a03] mt-1 ${SHADOW_ON_DARK}`
              }`}
            >
              {tabLabels[tab]}
            </button>
          );
        })}
      </div>

      <div
        className={`flex-1 overflow-y-auto p-2 ${FONT_BODY} text-[15px] text-[#1c1917] custom-scrollbar shadow-inner ${SHADOW_ON_LIGHT}`}
      >
        {activeTab === 'ITEMS' && (
          <div className="space-y-2">
            {items.map((item) => {
              const entry = inventory.find((i) => i.itemId === item.id);
              const qty = entry ? entry.rawQty : 0;
              return (
                <div key={item.id} className="flex justify-between items-center border-b border-[#d4d4d8] pb-1 gap-2">
                  <div className="leading-tight min-w-0">
                    <div className="font-bold truncate">{item.name}</div>
                    <div className="text-[15px] text-[#78350f]">Vốn: {formatVND(item.ingredientCost)}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        audioManager.playBlipSFX();
                        gs().buyIngredients(item.id, -1, item.ingredientCost);
                      }}
                      disabled={qty <= 0}
                      className="w-8 h-8 flex items-center justify-center bg-[#44403c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-sm border border-[#1c1917]"
                    >
                      -
                    </button>
                    <div className="w-8 h-8 flex items-center justify-center bg-white border border-[#78350f] font-bold text-[16px]">
                      {qty}
                    </div>
                    <button
                      onClick={() => {
                        audioManager.playBlipSFX();
                        gs().buyIngredients(item.id, 1, item.ingredientCost);
                      }}
                      disabled={cash < item.ingredientCost}
                      className="w-8 h-8 flex items-center justify-center bg-[#15803d] disabled:opacity-50 text-white font-bold rounded-sm border border-[#14532d]"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleStartCook(item)}
                      className={`ml-1 bg-[#991b1b] text-white px-2 h-8 border-2 border-[#450a0a] ${FONT_DISPLAY} text-[18px] hover:bg-[#b91c1c] ${SHADOW_ON_DARK}`}
                    >
                      CHẾ TẠO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'PRICING' && (
          <div className="flex flex-col h-full justify-center space-y-3">
            <div className={`text-center font-bold text-[16px] mb-1`}>{currentPricing.label}</div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  audioManager.playBlipSFX();
                  gs().setPricing('BINH_DAN');
                }}
                className={`${selectedPricing === 'BINH_DAN' ? 'bg-[#15803d] text-white' : 'bg-[#e6d5a7]'} px-3 py-1 ${FONT_DISPLAY} text-[18px] border-2 border-[#14532d]`}
              >
                BÌNH DÂN
              </button>
              <button
                onClick={() => {
                  audioManager.playBlipSFX();
                  gs().setPricing('HOP_LY');
                }}
                className={`${selectedPricing === 'HOP_LY' ? 'bg-[#ca8a04] text-white' : 'bg-[#e6d5a7]'} px-3 py-1 ${FONT_DISPLAY} text-[18px] border-2 border-[#713f12]`}
              >
                HỢP LÝ
              </button>
              <button
                onClick={() => {
                  audioManager.playBlipSFX();
                  gs().setPricing('CHAT_CHEM');
                }}
                className={`${selectedPricing === 'CHAT_CHEM' ? 'bg-[#991b1b] text-white' : 'bg-[#e6d5a7]'} px-3 py-1 ${FONT_DISPLAY} text-[18px] border-2 border-[#450a0a]`}
              >
                CHẶT CHÉM
              </button>
            </div>
          </div>
        )}

        {activeTab === 'DEBT' && (
          <div className="space-y-1">
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1">
              <span>Nợ hiện tại:</span>
              <span className="text-[#991b1b] font-bold">{formatVND(debt)}</span>
            </div>
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1">
              <span>Nghi ngờ thuế:</span>
              <span>{taxSuspicion}/100</span>
            </div>
            <div className="flex justify-between border-b border-[#d4d4d8] pb-1">
              <span>Giận của khách:</span>
              <span>{mobAnger}/100</span>
            </div>
          </div>
        )}

        {activeTab === 'LOG' && (
          <div className="space-y-1">
            {log
              .slice(-4)
              .reverse()
              .map((entry, i) => (
                <div key={`${log.length - i}-${entry}`} className="border-b border-[#d4d4d8] pb-1">
                  {entry}
                </div>
              ))}
          </div>
        )}
      </div>

      {!view.shiftActive && view.shiftTime > 0 ? (
        <button
          onClick={startShift}
          className={`w-full h-[44px] shrink-0 bg-[#991b1b] hover:bg-[#b91c1c] text-white ${FONT_DISPLAY} text-[22px] border-t-4 border-[#450a0a] ${SHADOW_ON_DARK}`}
        >
          BẮT ĐẦU CA MƯU SINH
        </button>
      ) : (
        <div
          className={`w-full h-[44px] shrink-0 bg-[#0c0a09] text-[#facc15] ${FONT_DISPLAY} text-[22px] border-t-4 border-[#450a0a] flex items-center justify-center ${SHADOW_ON_DARK}`}
        >
          {view.shiftTime <= 0
            ? 'KẾT THÚC CA LÀM VIỆC'
            : `CA LÀM VIỆC: 00:${Math.ceil(view.shiftTime).toString().padStart(2, '0')}`}
        </div>
      )}
    </div>
  );

  const renderDialogue = () => {
    const { customer, comeback } = view;
    const scenario = getScenario(customer.scenarioIdx);

    let speaker = 'Nhật Ký';
    let badge = 'NK';
    let text = view.shiftActive ? 'Đang chờ khách ghé quán...' : 'Mở cửa hàng đón khách nào!';

    if (view.shiftTime <= 0) {
      text = 'Hết ca rồi, dọn hàng thôi.';
    } else if (comeback !== null) {
      speaker = 'Chủ Quán';
      badge = 'CQ';
      text = `"${comeback}"`;
    } else if (customer.active) {
      speaker = 'Khách Hàng';
      badge = 'KH';
      if (customer.state === 'waiting') {
        const itemName = items.find((i) => i.id === customer.order)?.name;
        text = `"Cho tôi một ${itemName ?? 'suất'} nhé, lẹ lên!"`;
      } else if (customer.state === 'replying' || customer.state === 'happy') {
        text = scenario.quote;
      } else {
        text = '"Làm ăn lề mề quá, tôi đi quán khác!"';
      }
    }

    const showChoices = customer.active && customer.state === 'replying' && comeback === null;
    const choiceStyles = [
      'bg-[#15803d] hover:bg-[#166534] border-[#14532d]',
      'bg-[#991b1b] hover:bg-[#b91c1c] border-[#450a0a]',
      'bg-[#ca8a04] hover:bg-[#eab308] border-[#713f12]',
    ] as const;

    return (
      <div className="h-[26%] bg-[#1a0e08] p-2 flex flex-col items-center justify-center shrink-0 border-t-4 border-[#3f2010] relative z-10">
        <div className="bg-[#fef3c7] border-4 border-[#78350f] p-2 flex gap-3 items-start w-full h-full shadow-inner overflow-hidden">
          <div className="w-[48px] h-[48px] bg-[#d97706] border-2 border-[#78350f] flex-shrink-0 flex items-center justify-center mt-1 overflow-hidden">
            {badge === 'CQ' ? (
              <img src="/sprites/portraits/hero.png" alt="Chủ Quán" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
            ) : badge === 'KH' ? (
              <img src="/sprites/portraits/tra.png" alt="Khách Hàng" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
            ) : badge === 'NK' ? (
              <img src="/sprites/portraits/ongdao.png" alt="Nhật Ký" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
            ) : (
              <span className={`${FONT_DISPLAY} text-[24px] text-[#fef3c7] ${SHADOW_ON_DARK}`}>{badge}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto">
            <h3 className={`text-[#b45309] text-[18px] ${FONT_DISPLAY} uppercase leading-none ${SHADOW_ON_LIGHT}`}>
              {speaker}
            </h3>
            <p className={`text-[#1c1917] text-[16px] ${FONT_BODY} leading-tight mt-1 mb-1 ${SHADOW_ON_LIGHT}`}>{text}</p>

            {showChoices && (
              <div className="flex flex-col gap-1 mt-auto">
                {scenario.choices.map((choice, i) => (
                  <button
                    key={choice.label}
                    onClick={() => handleReply(i)}
                    className={`text-left text-white px-2 py-1 ${FONT_BODY} text-[15px] leading-tight border shadow-sm ${SHADOW_ON_DARK} ${choiceStyles[i]}`}
                  >
                    {`[${i + 1}] ${choice.label}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      {renderHUD()}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <RetroBackground />
        <div className="absolute inset-0 z-[1] flex flex-col">
          <StallViewport
            cookingSlots={view.slots}
            customer={view.customer}
            onDeliver={deliverFood}
            items={items as any[]}
            phoneRinging={phoneRinging}
            onPhoneClick={() => {
              setPhoneRinging(false);
              setShowPhone(true);
            }}
          />
        </div>
      </div>
      {renderTray()}
      {renderDialogue()}
      {showPhone && <PhoneScamModal onClose={() => setShowPhone(false)} />}
    </div>
  );
}
