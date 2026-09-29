import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function CharacterCanvas({ customerWaiting }: { customerWaiting?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dogLoyalty = useGameStore(s => s.dog.loyalty);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pX = 220, pY = 150;
    let dX = 180, dY = 150;
    let targetX = 220, targetY = 150;
    const speed = 2.5;
    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; targetX = pX; targetY = pY; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      targetX = (e.clientX - rect.left) * scaleX;
      targetY = (e.clientY - rect.top) * scaleY;
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (e.buttons > 0) handlePointerDown(e);
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);

    let animFrameId: number;
    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      let isMoving = false;
      let dx = 0;
      let dy = 0;

      if (keys['arrowup'] || keys['w']) { dy -= 1; }
      if (keys['arrowdown'] || keys['s']) { dy += 1; }
      if (keys['arrowleft'] || keys['a']) { dx -= 1; }
      if (keys['arrowright'] || keys['d']) { dx += 1; }

      if (dx === 0 && dy === 0) {
        const dist = Math.hypot(targetX - pX, targetY - pY);
        if (dist > speed) {
          dx = (targetX - pX) / dist;
          dy = (targetY - pY) / dist;
        } else {
          pX = targetX;
          pY = targetY;
        }
      }

      if (dx !== 0 || dy !== 0) {
        isMoving = true;
        pX += dx * speed;
        pY += dy * speed;
      }

      pX = Math.max(16, Math.min(canvas.width - 16, pX));
      pY = Math.max(16, Math.min(canvas.height - 16, pY));

      const distDog = Math.hypot(pX - dX, pY - dY);
      if (dogLoyalty >= 30) {
        if (distDog > 32) {
          dX += (pX - dX) * 0.05;
          dY += (pY - dY) * 0.05;
        }
      }

      // Draw Customer
      if (customerWaiting) {
         ctx.fillStyle = '#10b981'; // Green generic NPC
         ctx.fillRect(300 - 10, 160 - 20, 20, 40);
         ctx.fillStyle = '#fca5a5';
         ctx.fillRect(300 - 6, 160 - 30, 12, 10);
      }

      // Draw Dog (Flat shapes)
      ctx.fillStyle = '#eab308';
      ctx.fillRect(dX - 10, dY - 8, 20, 16); // Body
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(dX - 10 + (dx < 0 ? -4 : 16), dY - 12, 8, 8); // Head
      
      if (dogLoyalty < 30) {
          ctx.fillStyle = '#000';
          ctx.font = '12px sans-serif';
          ctx.fillText('Zzz', dX, dY - 14);
      }

      // Draw Hero (Flat shapes)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(pX - 10, pY - 20, 20, 40); // Body
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(pX - 6, pY - 30, 12, 10); // Head

      animFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [dogLoyalty, customerWaiting]);

  return (
    <canvas
      ref={canvasRef}
      width={440}
      height={300}
      className="absolute inset-0 w-full h-full z-20 touch-none pointer-events-auto cursor-pointer"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
