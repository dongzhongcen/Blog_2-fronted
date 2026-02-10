import { useState, useEffect } from 'react';
import type { GitHubContribution } from '@/types';

// Generate mock contribution data for the last year
function generateMockContributions(): GitHubContribution[] {
  const contributions: GitHubContribution[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Random contribution count with some patterns
    let count = 0;
    const random = Math.random();
    
    if (isWeekend) {
      // Less activity on weekends
      if (random > 0.7) count = Math.floor(Math.random() * 5) + 1;
    } else {
      // More activity on weekdays
      if (random > 0.3) count = Math.floor(Math.random() * 12) + 1;
    }

    // Determine level based on count
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0) level = 1;
    if (count >= 4) level = 2;
    if (count >= 7) level = 3;
    if (count >= 10) level = 4;

    contributions.push({
      date: d.toISOString().split('T')[0],
      count,
      level,
    });
  }

  return contributions;
}

export function useGitHubContributions(username?: string) {
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    streak: 0,
    maxDay: 0,
  });

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        
        // In production, you would use GitHub's GraphQL API
        // const response = await fetch('https://api.github.com/graphql', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     query: `
        //       query {
        //         user(login: "${username}") {
        //           contributionsCollection {
        //             contributionCalendar {
        //               weeks {
        //                 contributionDays {
        //                   date
        //                   contributionCount
        //                   contributionLevel
        //                 }
        //               }
        //             }
        //           }
        //         }
        //       }
        //     `,
        //   }),
        // });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        const data = generateMockContributions();
        setContributions(data);

        // Calculate stats
        const total = data.reduce((sum, d) => sum + d.count, 0);
        const maxDay = Math.max(...data.map((d) => d.count));
        
        // Calculate current streak
        let streak = 0;
        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i].count > 0) {
            streak++;
          } else {
            break;
          }
        }

        setStats({ total, streak, maxDay });
        setError(null);
      } catch (err) {
        setError('Failed to fetch contributions');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  return { contributions, loading, error, stats };
}

// Group contributions by week for the heatmap display
export function groupContributionsByWeek(contributions: GitHubContribution[]): GitHubContribution[][] {
  const weeks: GitHubContribution[][] = [];
  let currentWeek: GitHubContribution[] = [];

  contributions.forEach((day) => {
    const dayOfWeek = new Date(day.date).getDay();
    // Adjust so Monday is the first day (0)
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    if (adjustedDay === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek[adjustedDay] = day;
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

export function getContributionColor(level: number, isDark: boolean): string {
  const colors = {
    light: [
      'bg-gray-100',
      'bg-emerald-200',
      'bg-emerald-300',
      'bg-emerald-400',
      'bg-emerald-500',
    ],
    dark: [
      'bg-dark-700',
      'bg-emerald-900/50',
      'bg-emerald-800',
      'bg-emerald-600',
      'bg-emerald-400',
    ],
  };
  
  return colors[isDark ? 'dark' : 'light'][level];
}
