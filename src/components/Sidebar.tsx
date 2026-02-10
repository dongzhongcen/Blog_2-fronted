import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Moon, 
  MapPin, 
  Mail, 
  Github, 
  Twitter,
  Linkedin,
  Code2,
  Sparkles,
  Zap,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: (section: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'home', label: '首页', icon: Sparkles },
    { id: 'featured', label: '精选', icon: Zap },
    { id: 'posts', label: '文章', icon: TrendingUp },
    { id: 'about', label: '关于', icon: Code2 },
  ];

  const stats = [
    { label: '文章', value: '50+' },
    { label: '阅读', value: '12K+' },
    { label: '点赞', value: '2K+' },
  ];

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 z-40 flex flex-col" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)' }}>
      {/* Right border */}
      <div className="absolute right-0 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.3), transparent)' }} />
      
      {/* Content */}
      <div className="relative flex flex-col h-full p-6 overflow-y-auto">
        
        {/* Header - Logo & Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #047857)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DevBlog</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="p-5 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full blur-xl" style={{ background: 'rgba(16, 185, 129, 0.3)' }} />
              <Avatar className="w-24 h-24 border-4 relative" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" />
                <AvatarFallback className="text-2xl font-bold" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                  DB
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0a0a0a', border: '4px solid #0a0a0a' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Dev Blogger</h2>
            <p className="text-sm mb-3" style={{ color: '#34d399' }}>全栈开发者</p>
            
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
              <MapPin className="w-3 h-3" />
              <span>中国 · 北京</span>
            </div>

            {/* Stats */}
            <div className="flex gap-4 w-full justify-center">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-all group"
              style={{ background: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <item.icon className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
              <span className="font-medium">{item.label}</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </nav>

        {/* Tech Stack */}
        <Card className="p-4 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            技术栈
          </h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker'].map((tech) => (
              <Badge 
                key={tech} 
                variant="secondary"
                style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                className="hover:bg-emerald-500/20 transition-colors cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-4 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 className="text-sm font-semibold text-white mb-3">关注我</h3>
          <div className="flex gap-2">
            {[
              { icon: Github, href: 'https://github.com', label: 'GitHub' },
              { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:blog@example.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors group"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                title={label}
              >
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </a>
            ))}
          </div>
        </Card>

        {/* Current Time */}
        <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold" style={{ color: '#34d399' }}>
              {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
