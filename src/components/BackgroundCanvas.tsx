import { useEffect, useRef } from 'react';

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const draw = () => {
      time++;
      const w = canvas.width;
      const h = canvas.height;

      // Deep twilight gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#9a3412');
      grad.addColorStop(1, '#ea580c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Twinkling stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
        const y = (Math.cos(i * 321.45) * 0.5 + 0.5) * (h * 0.5);
        const blink = Math.sin(time * 0.05 + i) > 0.8 ? 1 : 0.3;
        ctx.globalAlpha = blink;
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.globalAlpha = 1;

      // Silhouetted roofs (background)
      ctx.fillStyle = '#0f0a14';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.lineTo(w * 0.3, h * 0.4);
      ctx.lineTo(w * 0.4, h * 0.45);
      ctx.lineTo(w * 0.7, h * 0.35);
      ctx.lineTo(w, h * 0.5);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Paved stone curb
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, h * 0.8, w, h * 0.2);
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 2;
      for (let i = 0; i < w; i += 30) {
        ctx.strokeRect(i, h * 0.8, 30, h * 0.2);
      }

      // Bamboo framing sides
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(5, 0, 8, h);
      ctx.fillRect(w - 15, 0, 10, h);
      ctx.fillStyle = '#022c22';
      for (let i = 0; i < h; i += 40) {
        ctx.fillRect(3, i, 12, 4);
        ctx.fillRect(w - 17, i + 10, 14, 4);
      }

      // Hanging red lanterns
      const drawLantern = (lx: number, ly: number, swing: number) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(Math.sin(time * 0.03 + swing) * 0.1);
        
        // String
        ctx.fillStyle = '#111';
        ctx.fillRect(-1, -20, 2, 20);
        
        // Glow
        const glow = ctx.createRadialGradient(0, 10, 0, 0, 10, 30);
        glow.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
        glow.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(-30, -20, 60, 60);

        // Body
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(-10, 0, 20, 25);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(-10, 5, 20, 2);
        ctx.fillRect(-10, 15, 20, 2);
        
        ctx.restore();
      };
      
      drawLantern(w * 0.2, 30, 0);
      drawLantern(w * 0.85, 40, 2);

      // Wooden cart
      ctx.fillStyle = '#451a03';
      ctx.fillRect(w * 0.4, h * 0.65, 80, 40);
      ctx.fillStyle = '#78350f'; // Roof
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.65);
      ctx.lineTo(w * 0.45, h * 0.55);
      ctx.lineTo(w * 0.65, h * 0.55);
      ctx.lineTo(w * 0.75, h * 0.65);
      ctx.fill();
      
      // Protagonist (Blue jacket)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(w * 0.5, h * 0.7, 16, 24);
      ctx.fillStyle = '#fca5a5'; // face
      ctx.fillRect(w * 0.5 + 4, h * 0.7 - 10, 8, 10);
      
      // Yellow dog Dung (Tail wagging)
      const dogX = w * 0.7;
      const dogY = h * 0.8 - 10;
      ctx.fillStyle = '#eab308'; // body
      ctx.fillRect(dogX, dogY, 20, 12);
      ctx.fillStyle = '#ca8a04'; // head
      ctx.fillRect(dogX - 6, dogY - 4, 10, 10);
      
      // Tail
      ctx.save();
      ctx.translate(dogX + 18, dogY + 2);
      ctx.rotate(Math.sin(time * 0.2) * 0.5 - 0.5);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(0, 0, 8, 4);
      ctx.restore();

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={440}
      height={300}
      className="w-full h-full object-cover pixelated"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
