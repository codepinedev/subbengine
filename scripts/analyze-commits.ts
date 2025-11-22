#!/usr/bin/env bun

/**
 * Git Commit Pattern Analysis Script
 * Analyzes your git history to reveal coding patterns for your blog post
 */

import { execSync } from 'child_process';

interface Commit {
  hash: string;
  date: Date;
  author: string;
  message: string;
  hour: number;
  dayOfWeek: string;
  type: string;
}

interface Stats {
  totalCommits: number;
  dateRange: { start: Date; end: Date };
  morningCommits: number; // 5-9 AM
  dayCommits: number; // 9 AM - 5 PM
  eveningCommits: number; // 5 PM - 12 AM
  nightCommits: number; // 12 AM - 5 AM
  commitsByHour: Record<number, number>;
  commitsByDay: Record<string, number>;
  commitTypes: Record<string, number>;
  averageCommitsPerDay: number;
  longestStreak: number;
}

function getGitCommits(): Commit[] {
  const gitLog = execSync(
    'git log --pretty=format:"%H|%ad|%an|%s" --date=iso --all',
    { encoding: 'utf-8' }
  );

  const commits: Commit[] = gitLog
    .trim()
    .split('\n')
    .filter(line => line && !line.includes('Turbobot')) // Filter out turbo setup commits
    .map(line => {
      const [hash, dateStr, author, message] = line.split('|');
      const date = new Date(dateStr);
      const hour = date.getHours();
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Extract commit type (feat, fix, refactor, etc.)
      const typeMatch = message.match(/^(feat|fix|refactor|docs|test|chore|style|perf):/i);
      const type = typeMatch ? typeMatch[1].toLowerCase() : 'other';

      return { hash, date, author, message, hour, dayOfWeek, type };
    });

  return commits;
}

function analyzeCommits(commits: Commit[]): Stats {
  const stats: Stats = {
    totalCommits: commits.length,
    dateRange: {
      start: commits[commits.length - 1].date,
      end: commits[0].date,
    },
    morningCommits: 0,
    dayCommits: 0,
    eveningCommits: 0,
    nightCommits: 0,
    commitsByHour: {},
    commitsByDay: {},
    commitTypes: {},
    averageCommitsPerDay: 0,
    longestStreak: 0,
  };

  // Initialize hours
  for (let i = 0; i < 24; i++) {
    stats.commitsByHour[i] = 0;
  }

  // Analyze each commit
  commits.forEach(commit => {
    const hour = commit.hour;

    // Time of day categorization
    if (hour >= 5 && hour < 9) stats.morningCommits++;
    else if (hour >= 9 && hour < 17) stats.dayCommits++;
    else if (hour >= 17 && hour < 24) stats.eveningCommits++;
    else stats.nightCommits++;

    // Hour distribution
    stats.commitsByHour[hour]++;

    // Day of week
    stats.commitsByDay[commit.dayOfWeek] = (stats.commitsByDay[commit.dayOfWeek] || 0) + 1;

    // Commit types
    stats.commitTypes[commit.type] = (stats.commitTypes[commit.type] || 0) + 1;
  });

  // Calculate average commits per day
  const daysDiff = Math.ceil(
    (stats.dateRange.end.getTime() - stats.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
  );
  stats.averageCommitsPerDay = stats.totalCommits / daysDiff;

  // Calculate longest streak
  const commitDates = commits.map(c => c.date.toDateString());
  const uniqueDates = [...new Set(commitDates)];
  stats.longestStreak = calculateStreak(uniqueDates);

  return stats;
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sortedDates = dates.sort();
  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function printStats(stats: Stats, commits: Commit[]) {
  console.log('\n📊 GIT COMMIT ANALYSIS FOR YOUR BLOG POST\n');
  console.log('=' .repeat(60));

  console.log('\n📅 PROJECT TIMELINE');
  console.log(`   First commit: ${stats.dateRange.start.toLocaleDateString()}`);
  console.log(`   Latest commit: ${stats.dateRange.end.toLocaleDateString()}`);
  console.log(`   Total commits: ${stats.totalCommits}`);
  console.log(`   Average per day: ${stats.averageCommitsPerDay.toFixed(1)}`);
  console.log(`   Longest streak: ${stats.longestStreak} days`);

  console.log('\n⏰ THE 5AM GRIND - COMMITS BY TIME OF DAY');
  console.log(`   🌅 Morning (5-9 AM):    ${stats.morningCommits} commits (${((stats.morningCommits/stats.totalCommits)*100).toFixed(1)}%)`);
  console.log(`   ☀️  Day (9 AM-5 PM):     ${stats.dayCommits} commits (${((stats.dayCommits/stats.totalCommits)*100).toFixed(1)}%)`);
  console.log(`   🌆 Evening (5 PM-12 AM): ${stats.eveningCommits} commits (${((stats.eveningCommits/stats.totalCommits)*100).toFixed(1)}%)`);
  console.log(`   🌙 Night (12-5 AM):      ${stats.nightCommits} commits (${((stats.nightCommits/stats.totalCommits)*100).toFixed(1)}%)`);

  console.log('\n⏱️  HOURLY BREAKDOWN (Peak coding times)');
  const sortedHours = Object.entries(stats.commitsByHour)
    .filter(([_, count]) => count > 0)
    .sort(([a], [b]) => Number(a) - Number(b));

  sortedHours.forEach(([hour, count]) => {
    const bar = '█'.repeat(count);
    const timeLabel = `${hour.padStart(2, '0')}:00`;
    console.log(`   ${timeLabel} ${bar} ${count}`);
  });

  console.log('\n📆 COMMITS BY DAY OF WEEK');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.forEach(day => {
    const count = stats.commitsByDay[day] || 0;
    const bar = '█'.repeat(Math.ceil(count / 2));
    console.log(`   ${day.padEnd(10)} ${bar} ${count}`);
  });

  console.log('\n🏗️  COMMIT TYPES (What you built)');
  Object.entries(stats.commitTypes)
    .sort(([, a], [, b]) => b - a)
    .forEach(([type, count]) => {
      const emoji = {
        feat: '✨',
        fix: '🐛',
        refactor: '♻️',
        docs: '📝',
        test: '✅',
        chore: '🔧',
        style: '💄',
        perf: '⚡',
        other: '📦'
      }[type] || '📦';
      const bar = '█'.repeat(count);
      console.log(`   ${emoji} ${type.padEnd(10)} ${bar} ${count}`);
    });

  console.log('\n📝 RECENT COMMIT MESSAGES (The journey)');
  commits.slice(0, 10).forEach(commit => {
    const time = commit.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = commit.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    console.log(`   ${date} ${time} - ${commit.message}`);
  });

  console.log('\n💡 BLOG POST INSIGHTS');
  console.log(`   • You made ${stats.morningCommits} commits before 9 AM - that's dedication!`);
  console.log(`   • Peak coding hour: ${Object.entries(stats.commitsByHour).sort(([,a], [,b]) => b - a)[0][0]}:00`);
  console.log(`   • Most productive day: ${Object.entries(stats.commitsByDay).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}`);
  console.log(`   • Feature commits: ${stats.commitTypes.feat || 0}, Bug fixes: ${stats.commitTypes.fix || 0}`);

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Analysis complete! Use these stats in your blog post.\n');
}

// Generate JSON output for visualizations
function generateJSONOutput(stats: Stats, commits: Commit[]) {
  const output = {
    summary: {
      totalCommits: stats.totalCommits,
      dateRange: {
        start: stats.dateRange.start.toISOString(),
        end: stats.dateRange.end.toISOString(),
      },
      averageCommitsPerDay: Number(stats.averageCommitsPerDay.toFixed(2)),
      longestStreak: stats.longestStreak,
    },
    timeOfDay: {
      morning: stats.morningCommits,
      day: stats.dayCommits,
      evening: stats.eveningCommits,
      night: stats.nightCommits,
    },
    hourlyDistribution: stats.commitsByHour,
    weeklyDistribution: stats.commitsByDay,
    commitTypes: stats.commitTypes,
    commits: commits.slice(0, 20).map(c => ({
      hash: c.hash.substring(0, 7),
      date: c.date.toISOString(),
      message: c.message,
      hour: c.hour,
      type: c.type,
    })),
  };

  return output;
}

// Main execution
try {
  console.log('🔍 Analyzing git history...\n');

  const commits = getGitCommits();
  const stats = analyzeCommits(commits);

  printStats(stats, commits);

  // Save JSON for visualizations
  const jsonOutput = generateJSONOutput(stats, commits);
  await Bun.write('commit-analysis.json', JSON.stringify(jsonOutput, null, 2));
  console.log('💾 Saved detailed analysis to commit-analysis.json\n');

} catch (error) {
  console.error('❌ Error analyzing commits:', error);
  process.exit(1);
}
