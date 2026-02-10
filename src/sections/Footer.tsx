import { 
  Github, 
  Twitter, 
  Mail, 
  Rss,
  Heart,
  Code2
} from 'lucide-react';

const footerLinks = {
  导航: [
    { label: '首页', href: '#home' },
    { label: '文章', href: '#posts' },
    { label: '关于', href: '#about' },
  ],
  分类: [
    { label: 'React', href: '#posts' },
    { label: 'Node.js', href: '#posts' },
    { label: 'DevOps', href: '#posts' },
  ],
  链接: [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Vercel', href: 'https://vercel.com' },
    { label: 'Neon', href: 'https://neon.tech' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TechBlog</span>
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              记录技术成长的每一步，分享前端、后端、DevOps 等技术笔记。
            </p>
            <div className="flex gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:blog@example.com"
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="/rss.xml"
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} TechBlog. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> using React & Tailwind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
