import { WeatherWidget } from '@/components/WeatherWidget';
import { GitHubContributions } from '@/components/GitHubContributions';
import { AdSidebar, sampleAds } from '@/components/AdBanner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Mail, 
  Github, 
  Twitter,
  Linkedin,
  Code2,
  Sparkles
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="space-y-6">
      {/* Profile Card */}
      <Card className="glass-card overflow-hidden">
        <div className="relative">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-700" />
          
          {/* Avatar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <Avatar className="w-20 h-20 border-4 border-white dark:border-dark-900">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                TB
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Tech Blogger
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            全栈开发者 · 技术博主
          </p>

          <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>中国 · 浙江</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            热爱技术，专注于 Web 开发和云原生技术。
            在这里记录学习笔记，分享实践经验。
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="mailto:blog@example.com">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Weather */}
      <WeatherWidget />

      {/* GitHub Contributions */}
      <GitHubContributions username="your-github-username" />

      {/* Tech Stack */}
      <Card className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            技术栈
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker', 'Tailwind'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            >
              {tech}
            </span>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Card className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            订阅更新
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          订阅获取最新文章和技术资讯
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50"
          />
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            订阅
          </Button>
        </div>
      </Card>

      {/* Ads */}
      <AdSidebar ads={sampleAds} />
    </aside>
  );
}
