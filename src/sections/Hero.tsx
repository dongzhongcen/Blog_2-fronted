import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Zap, BookOpen } from 'lucide-react';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToPosts = () => {
    document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            记录技术成长的每一步
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gray-900 dark:text-white">探索</span>
          <span className="gradient-text"> 技术 </span>
          <span className="text-gray-900 dark:text-white">的无限可能</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          分享前端开发、后端架构、DevOps 实践等技术笔记，
          <br className="hidden sm:block" />
          与志同道合的开发者一起成长
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">技术文章</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">总阅读量</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            onClick={scrollToPosts}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 shadow-glow hover:shadow-emerald-500/50 transition-all"
          >
            浏览文章
            <ArrowDown className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            asChild
          >
            <a href="#about">了解更多</a>
          </Button>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
