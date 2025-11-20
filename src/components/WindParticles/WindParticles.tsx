import { useEffect, useRef } from 'react';

interface WindParticlesProps {
  particleCount?: number;
  color?: string;
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export function WindParticles({
  particleCount = 20,
  color = '#3b82f6',
  speed = 2,
}: WindParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateCanvasSize();

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 20 + 10,
      speed: (Math.random() * 2 + 1) * speed,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Draw particle as a line
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = particle.opacity;
        ctx.lineWidth = 1.5;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.length, particle.y);
        ctx.stroke();

        // Update position
        particle.x += particle.speed;

        // Reset particle when it goes off screen
        if (particle.x > canvas.width + particle.length) {
          particle.x = -particle.length;
          particle.y = Math.random() * canvas.height;
          particle.opacity = Math.random() * 0.5 + 0.3;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
