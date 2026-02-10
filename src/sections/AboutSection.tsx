import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  Server, 
  Database, 
  Cloud,
  ArrowRight,
  Terminal,
  Cpu,
  Globe
} from 'lucide-react';

const skills = [
  {
    icon: Code2,
    title: '前端开发',
    description: 'React, Vue, TypeScript, Tailwind CSS',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Server,
    title: '后端开发',
    description: 'Node.js, Python, Go, RESTful API',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Database,
    title: '数据库',
    description: 'PostgreSQL, MongoDB, Redis',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Cloud,
    title: '云原生',
    description: 'Docker, Kubernetes, AWS, CI/CD',
    color: 'from-purple-500 to-pink-500',
  },
];

const stats = [
  { label: '代码行数', value: '100K+', icon: Terminal },
  { label: '项目经验', value: '30+', icon: Cpu },
  { label: '技术文章', value: '50+', icon: Globe },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            关于<span className="gradient-text">我</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            一名热爱技术的全栈开发者，专注于构建高质量的 Web 应用
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Skills */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {skills.map((skill) => (
            <Card
              key={skill.title}
              className="glass-card p-6 group hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <skill.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {skill.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {skill.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            有项目合作意向或技术交流？欢迎联系我
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 shadow-glow"
            asChild
          >
            <a href="mailto:contact@example.com">
              联系我
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
