import { memo } from 'react';

/*
 * Pixel-art night street in the Hanoi old quarter, drawn as one inline SVG on a
 * 160 x 100 grid and scaled with crisp edges. Motifs: dusk sky, tube-house skyline,
 * tiled shophouse roofs with green shutters, red awnings, paper lanterns, a utility
 * pole with a tangle of wires and a transformer, and a brick street.
 * No external assets.
 */

const W = 160;
const STREET_Y = 80;

const SKY_BANDS = [
  '#120b2e',
  '#1a1040',
  '#2a1250',
  '#3f1558',
  '#5c1a5e',
  '#7d2160',
  '#a02a58',
  '#c63d4c',
  '#e0603f',
  '#f08c3a',
  '#f7b955',
] as const;
const BAND_H = 7;

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  o?: number;
}

function circleRects(cx: number, cy: number, r: number): Rect[] {
  const rows: Rect[] = [];
  for (let dy = -r; dy <= r; dy += 1) {
    const half = Math.round(Math.sqrt(r * r - dy * dy));
    rows.push({ x: cx - half, y: cy + dy, w: half * 2 + 1, h: 1 });
  }
  return rows;
}

interface FarBlock extends Rect {
  tank: boolean;
  antenna: boolean;
}

function buildScene() {
  const rnd = mulberry32(20240607);

  const stars: Rect[] = [];
  for (let i = 0; i < 36; i += 1) {
    stars.push({
      x: Math.floor(rnd() * W),
      y: Math.floor(rnd() * 34),
      w: 1,
      h: 1,
      o: 0.35 + rnd() * 0.6,
    });
  }

  const farBlocks: FarBlock[] = [];
  const farWindows: Rect[] = [];
  let fx = -2;
  while (fx < W) {
    const w = 7 + Math.floor(rnd() * 6);
    const top = 46 + Math.floor(rnd() * 14);
    farBlocks.push({
      x: fx,
      y: top,
      w,
      h: STREET_Y - top,
      tank: rnd() < 0.35,
      antenna: rnd() < 0.25,
    });
    for (let wy = top + 3; wy < STREET_Y - 4; wy += 4) {
      for (let wx = fx + 1; wx < fx + w - 1; wx += 3) {
        if (rnd() < 0.16) farWindows.push({ x: wx, y: wy, w: 1, h: 2 });
      }
    }
    fx += w;
  }

  return { stars, farBlocks, farWindows, moon: circleRects(128, 13, 6) };
}

const SCENE = buildScene();

/* Lantern string between the two shophouses. */
const LANTERN_X = [42, 54, 66, 78, 90, 104, 118] as const;
const lanternY = (x: number): number => Math.round(31 + 7 * Math.sin((Math.PI * (x - 34)) / 92));
const LANTERNS = LANTERN_X.map((x, i) => ({ x, y: lanternY(x), delay: i * 260 }));
const LANTERN_WIRE = Array.from({ length: 47 }, (_, i) => {
  const x = 34 + i * 2;
  return `${x},${lanternY(x)}`;
}).join(' ');

interface ShophouseProps {
  x: number;
  w: number;
  top: number;
  flip: boolean;
}

function Shophouse({ x, w, top, flip }: ShophouseProps) {
  const wallTop = top + 10;
  const right = x + w;
  const wallH = STREET_Y - wallTop;
  const roofPts = `${x - 6},${wallTop + 1} ${x + 1},${top} ${right - 1},${top} ${right + 6},${wallTop + 1}`;
  const shadeX = flip ? right - 4 : x;
  const signX = flip ? x + 2 : right - 7;
  const winY = wallTop + 5;
  const win1 = x + 6;
  const win2 = x + w - 12;

  const windows = [
    { wx: win1, lit: true },
    { wx: win2, lit: false },
  ];

  return (
    <g>
      {/* light spill on the pavement */}
      <polygon
        points={`${x},${STREET_Y} ${right},${STREET_Y} ${right + 8},${STREET_Y + 14} ${x - 8},${STREET_Y + 14}`}
        fill="#f7b955"
        opacity="0.1"
      />
      <rect x={x} y={wallTop} width={w} height={wallH} fill="#5a3a26" />
      <rect x={shadeX} y={wallTop} width="4" height={wallH} fill="#3f2618" />

      {/* curved tile roof */}
      <polygon points={roofPts} fill="url(#roofTiles)" />
      <rect x={x + 1} y={top} width={w - 2} height="1" fill="#0f070a" />
      <rect x={x - 6} y={wallTop + 1} width={w + 12} height="1" fill="#0f070a" />
      <rect x={x - 7} y={wallTop} width="1" height="1" fill="#0f070a" />
      <rect x={right + 6} y={wallTop} width="1" height="1" fill="#0f070a" />
      <rect x={x} y={wallTop + 2} width={w} height="2" fill="#2a160f" />

      {/* upper windows with green shutters */}
      {windows.map(({ wx, lit }) => (
        <g key={wx}>
          <rect x={wx} y={winY} width="6" height="8" fill="#140a0c" />
          <rect x={wx + 1} y={winY + 1} width="4" height="6" fill={lit ? '#f7c35a' : '#22161c'} opacity={lit ? 0.85 : 1} />
          <rect x={wx} y={winY + 1} width="1" height="6" fill="#2f6b55" />
          <rect x={wx + 5} y={winY + 1} width="1" height="6" fill="#2f6b55" />
        </g>
      ))}

      {/* balcony rail */}
      <rect x={x + 4} y={wallTop + 14} width={w - 8} height="1" fill="#140a0c" />
      {Array.from({ length: Math.floor((w - 8) / 2) }, (_, i) => (
        <rect key={i} x={x + 4 + i * 2} y={wallTop + 15} width="1" height="2" fill="#140a0c" />
      ))}

      {/* hanging shop sign */}
      <rect x={signX - 1} y={wallTop + 1} width="7" height="18" fill="#140a0c" />
      <rect x={signX} y={wallTop + 2} width="5" height="16" fill="#b91c1c" />
      <rect x={signX + 1} y={wallTop + 4} width="3" height="2" fill="#facc15" />
      <rect x={signX + 1} y={wallTop + 9} width="3" height="2" fill="#facc15" />
      <rect x={signX + 1} y={wallTop + 14} width="3" height="2" fill="#facc15" />

      {/* shop front: awning and lit opening */}
      <rect x={x + 3} y={STREET_Y - 15} width={w - 6} height="15" fill="url(#shopGlow)" />
      <rect x={x + 6} y={STREET_Y - 6} width={w - 12} height="6" fill="#2a160f" />
      <rect x={x + 8} y={STREET_Y - 9} width="3" height="3" fill="#7a3b1e" />
      <rect x={x + 13} y={STREET_Y - 8} width="4" height="2" fill="#140a0c" />
      <polygon
        points={`${x + 2},${STREET_Y - 20} ${right - 2},${STREET_Y - 20} ${right + 1},${STREET_Y - 15} ${x - 1},${STREET_Y - 15}`}
        fill="url(#awning)"
      />
      <rect x={x - 1} y={STREET_Y - 15} width={w + 2} height="1" fill="#140a0c" />
    </g>
  );
}

export const RetroBackground = memo(function RetroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#120b2e]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 160 100"
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
      >
        <defs>
          <pattern id="roofTiles" width="4" height="3" patternUnits="userSpaceOnUse">
            <rect width="4" height="3" fill="#3a1a22" />
            <rect y="0" width="4" height="1" fill="#4b222a" />
            <rect y="1" width="4" height="1" fill="#2c141b" />
            <rect x="3" y="0" width="1" height="3" fill="#1f0f14" />
          </pattern>
          <pattern id="awning" width="6" height="4" patternUnits="userSpaceOnUse">
            <rect width="6" height="4" fill="#b91c1c" />
            <rect x="3" width="3" height="4" fill="#d6bf8a" />
          </pattern>
          <pattern id="bricks" width="10" height="6" patternUnits="userSpaceOnUse">
            <rect width="10" height="3" fill="#5a2f2a" />
            <rect y="3" width="10" height="3" fill="#64342d" />
            <rect y="2" width="10" height="1" fill="#2e1718" />
            <rect y="5" width="10" height="1" fill="#2e1718" />
            <rect x="0" y="0" width="1" height="2" fill="#2e1718" />
            <rect x="5" y="3" width="1" height="2" fill="#2e1718" />
          </pattern>
          <linearGradient id="shopGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd27a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="lanternGlow">
            <stop offset="0" stopColor="#ff5a36" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff5a36" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="streetShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* dusk sky in hard bands */}
        {SKY_BANDS.map((color, i) => (
          <rect key={color} x="0" y={i * BAND_H} width={W} height={BAND_H} fill={color} />
        ))}
        <rect x="0" y={SKY_BANDS.length * BAND_H} width={W} height={STREET_Y - SKY_BANDS.length * BAND_H} fill="#f7b955" />

        {/* stars and moon */}
        {SCENE.stars.map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width="1" height="1" fill="#fde7a8" opacity={s.o} />
        ))}
        <circle cx="128.5" cy="13.5" r="13" fill="#fde7a8" opacity="0.12" />
        {SCENE.moon.map((r) => (
          <rect key={r.y} x={r.x} y={r.y} width={r.w} height={r.h} fill="#fde7a8" />
        ))}

        {/* distant tube-house skyline */}
        {SCENE.farBlocks.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#2b1538" />
            <rect x={b.x} y={b.y} width={b.w} height="1" fill="#3d1f4a" />
            {b.tank ? <rect x={b.x + 2} y={b.y - 3} width="3" height="3" fill="#2b1538" /> : null}
            {b.antenna ? <rect x={b.x + b.w - 2} y={b.y - 4} width="1" height="4" fill="#2b1538" /> : null}
          </g>
        ))}
        {SCENE.farWindows.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width="1" height="2" fill="#f4b860" opacity="0.75" />
        ))}

        {/* utility pole, transformer and wires */}
        <rect x="95" y="12" width="2" height={STREET_Y - 12} fill="#0f0a14" />
        <rect x="91" y="15" width="10" height="1" fill="#0f0a14" />
        <rect x="92" y="19" width="8" height="1" fill="#0f0a14" />
        <rect x="98" y="24" width="5" height="6" fill="#3b3b4f" />
        <rect x="98" y="24" width="5" height="1" fill="#55556e" />
        <rect x="100" y="27" width="1" height="1" fill="#ef4444" className="motion-safe:animate-pulse" />
        {[91, 93, 99, 101].map((ix) => (
          <rect key={ix} x={ix} y="14" width="1" height="1" fill="#2a2a3a" />
        ))}
        {[
          'M0 14 Q48 24 93 15',
          'M101 15 Q132 26 160 18',
          'M93 19 Q60 30 26 30',
          'M99 19 Q122 28 134 26',
          'M101 20 Q132 34 160 30',
          'M0 22 Q45 34 91 16',
        ].map((d) => (
          <path key={d} d={d} fill="none" stroke="#0b0510" strokeWidth="0.5" />
        ))}

        {/* shophouses */}
        <Shophouse x={-6} w={40} top={26} flip={false} />
        <Shophouse x={126} w={40} top={22} flip />

        {/* lantern string */}
        <polyline points={LANTERN_WIRE} fill="none" stroke="#0b0510" strokeWidth="0.5" />
        {LANTERNS.map((l) => (
          <g key={l.x} transform={`translate(${l.x} ${l.y})`}>
            <circle
              cx="1.5"
              cy="4"
              r="8"
              fill="url(#lanternGlow)"
              className="motion-safe:animate-pulse"
              style={{ animationDelay: `${l.delay}ms` }}
            />
            <rect x="0" y="0" width="3" height="1" fill="#facc15" />
            <rect x="-0.5" y="1" width="4" height="4" fill="#dc2626" />
            <rect x="0.5" y="2" width="2" height="1" fill="#fb923c" />
            <rect x="0" y="5" width="3" height="1" fill="#facc15" />
            <rect x="1" y="6" width="1" height="2" fill="#facc15" />
          </g>
        ))}

        {/* pavement and brick street */}
        <rect x="0" y={STREET_Y} width={W} height="4" fill="#4a3338" />
        <rect x="0" y={STREET_Y} width={W} height="1" fill="#8a6a6e" />
        <rect x="0" y={STREET_Y + 4} width={W} height="1" fill="#1f1014" />
        <rect x="0" y={STREET_Y + 5} width={W} height={100 - STREET_Y - 5} fill="url(#bricks)" />
        <rect x="0" y={STREET_Y + 5} width={W} height={100 - STREET_Y - 5} fill="url(#streetShade)" />

        {/* lantern reflections on the wet bricks */}
        {LANTERN_X.map((x, i) => (
          <rect key={x} x={x - 3} y={STREET_Y + 9 + (i % 3) * 3} width="7" height="1" fill="#f7b955" opacity="0.12" />
        ))}
      </svg>

      {/* CRT scanlines and vignette */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />
    </div>
  );
});
