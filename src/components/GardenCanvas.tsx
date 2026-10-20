import React, { useEffect, useRef } from 'react';
import { FlowerTheme } from '../types/flower';

interface GardenCanvasProps {
  theme: FlowerTheme;
  isBursting: boolean;
  onBurstComplete?: () => void;
}

interface PetalParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  type: 'petal' | 'sparkle' | 'dew';
  swing: number;
  swingSpeed: number;
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({
  theme,
  isBursting,
  onBurstComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<PetalParticle[]>([]);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Initial particles
    const initParticles = () => {
      const list: PetalParticle[] = [];
      const count = Math.min(35, Math.floor(width / 35));

      for (let i = 0; i < count; i++) {
        const isSparkle = Math.random() > 0.65;
        list.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: isSparkle ? 2 + Math.random() * 3 : 8 + Math.random() * 12,
          speedX: 0.3 + Math.random() * 0.8,
          speedY: 0.5 + Math.random() * 1.2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          color: isSparkle
            ? '#fff4cc'
            : theme.ambientPetalColors[
                Math.floor(Math.random() * theme.ambientPetalColors.length)
              ],
          opacity: isSparkle ? 0.4 + Math.random() * 0.5 : 0.5 + Math.random() * 0.4,
          type: isSparkle ? 'sparkle' : 'petal',
          swing: Math.random() * Math.PI * 2,
          swingSpeed: 0.02 + Math.random() * 0.03
        });
      }
      particlesRef.current = list;
    };

    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mousePosRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.swing += p.swingSpeed;
        p.x += p.speedX + Math.sin(p.swing) * 0.8;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Interaction with mouse/touch: gentle push
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }

        // Wrap around
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'sparkle') {
          // Cute diamond star / sparkle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

          // cross sparkle
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.size * 2, 0);
          ctx.lineTo(p.size * 2, 0);
          ctx.moveTo(0, -p.size * 2);
          ctx.lineTo(0, p.size * 2);
          ctx.stroke();
        } else {
          // Petal shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 0.75,
            -p.size * 0.7,
            p.size * 0.85,
            p.size * 0.5,
            0,
            p.size
          );
          ctx.bezierCurveTo(
            -p.size * 0.85,
            p.size * 0.5,
            -p.size * 0.75,
            -p.size * 0.7,
            0,
            -p.size
          );
          ctx.fill();

          // Subtle petal highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.8);
          ctx.lineTo(0, p.size * 0.6);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  // Burst effect when requested
  useEffect(() => {
    if (!isBursting || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.45;

    // Spawn 40 energetic burst petals from the flower center
    const burstCount = 45;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5);
      const speed = 3 + Math.random() * 8;
      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        size: 9 + Math.random() * 12,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 2.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        color:
          theme.ambientPetalColors[
            Math.floor(Math.random() * theme.ambientPetalColors.length)
          ],
        opacity: 0.9,
        type: 'petal',
        swing: Math.random() * Math.PI,
        swingSpeed: 0.05
      });
    }

    if (onBurstComplete) {
      setTimeout(onBurstComplete, 600);
    }
  }, [isBursting, theme, onBurstComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ opacity: 0.85 }}
    />
  );
};
