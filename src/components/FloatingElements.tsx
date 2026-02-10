import { useEffect, useState } from 'react';
import { Code2, Terminal, Database, Cloud, Cpu, Globe, Layers, Zap } from 'lucide-react';

interface FloatingIcon {
  id: number;
  icon: React.ElementType;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function FloatingElements() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    const iconComponents = [Code2, Terminal, Database, Cloud, Cpu, Globe, Layers, Zap];
    
    const generatedIcons = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      icon: iconComponents[i % iconComponents.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 20,
      opacity: Math.random() * 0.15 + 0.05,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));

    setIcons(generatedIcons);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="absolute animate-float"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <Icon
              size={item.size}
              style={{ 
                opacity: item.opacity,
                color: '#10b981',
              }}
              strokeWidth={1}
            />
          </div>
        );
      })}
    </div>
  );
}

// Animated gradient orbs
export function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large orb 1 */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
          top: '-10%',
          right: '-10%',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Large orb 2 */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 animate-float-delayed"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          bottom: '10%',
          left: '-5%',
          filter: 'blur(80px)',
        }}
      />

      {/* Small orb */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full opacity-10 animate-bounce-subtle"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.5) 0%, transparent 70%)',
          top: '40%',
          right: '20%',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}

// Animated grid background
export function GridBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  );
}
