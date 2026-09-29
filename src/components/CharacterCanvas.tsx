import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function CharacterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dogLoyalty = useGameStore(s => s.dog.loyalty);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const heroImg = new Image();
    heroImg.src = '/sprites/hero_walk.png';
    const dogImg = new Image();
    dogImg.src = '/sprites/dog_dung.png';

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

    let frame = 0;
    let direction = 0;
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
        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? 3 : 2;
        } else {
          direction = dy > 0 ? 0 : 1;
        }
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

      if (isMoving && tick % 8 === 0) {
        frame = (frame + 1) % 4;
      } else if (!isMoving) {
        frame = 0;
      }

      if (dogImg.complete && dogImg.naturalWidth > 0) {
         const dogFrame = dogLoyalty < 30 ? 3 : (distDog > 32 && tick % 10 < 5 ? 1 : 0);
         ctx.drawImage(dogImg, dogFrame * 16, 0, 16, 16, dX - 16, dY - 16, 32, 32);
      } else {
         ctx.fillStyle = '#eab308';
         ctx.fillRect(dX - 10, dY - 8, 20, 16);
         if (dogLoyalty < 30) {
             ctx.fillStyle = '#000';
             ctx.font = '10px "VT323"';
             ctx.fillText('Zzz', dX, dY - 10);
         }
      }

      if (heroImg.complete && heroImg.naturalWidth > 0) {
         ctx.drawImage(heroImg, frame * 16, direction * 24, 16, 24, pX - 16, pY - 24, 32, 48);
      } else {
         ctx.fillStyle = '#1e3a8a';
         ctx.fillRect(pX - 10, pY - 20, 20, 40);
         ctx.fillStyle = '#fca5a5';
         ctx.fillRect(pX - 6, pY - 30, 12, 10);
      }

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
  }, [dogLoyalty]);

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
