// ====== 2D TOP-DOWN CANVAS ======
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function TopDownCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Player and dog positions
    let px = 50, py = 50;
    let dx = 40, dy = 60;
    const speed = 2;

    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;

    const render = () => {
      // Movement
      if (keys['w'] || keys['ArrowUp']) py -= speed;
      if (keys['s'] || keys['ArrowDown']) py += speed;
      if (keys['a'] || keys['ArrowLeft']) px -= speed;
      if (keys['d'] || keys['ArrowRight']) px += speed;

      // Boundaries
      px = Math.max(10, Math.min(canvas.width - 10, px));
      py = Math.max(10, Math.min(canvas.height - 10, py));

      // Dog follows player (simple pathfinding/steering)
      const dist = Math.hypot(px - dx, py - dy);
      if (dist > 20) {
        dx += (px - dx) * 0.05;
        dy += (py - dy) * 0.05;
      }

      // Draw background
      ctx.fillStyle = '#2d1b4e'; // street color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw objects (Stall/Desk)
      ctx.fillStyle = '#92400e';
      ctx.fillRect(canvas.width / 2 - 30, canvas.height / 2 - 20, 60, 40);

      // Draw Dog (Dũng)
      ctx.fillStyle = '#fbbf24'; // Yellow dog
      ctx.fillRect(dx - 5, dy - 5, 10, 10);
      
      // Draw Player
      ctx.fillStyle = '#ef4444'; // Red shirt
      ctx.fillRect(px - 6, py - 6, 12, 12);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full relative border-b-2 border-gold-accent/50 bg-[#1a1a2e]">
      <canvas
        ref={canvasRef}
        width={460}
        height={300}
        className="w-full h-full object-cover"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Mobile controls overlay */}
      <div className="absolute bottom-2 left-2 flex gap-1 opacity-50">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-pixel text-[8px] mb-1 text-white">W</div>
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-pixel text-[8px] text-white">A</div>
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-pixel text-[8px] text-white">S</div>
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-pixel text-[8px] text-white">D</div>
          </div>
        </div>
      </div>
    </div>
  );
}
