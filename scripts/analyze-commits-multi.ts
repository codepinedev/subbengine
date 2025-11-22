#!/usr/bin/env bun

/**
 * Multi-Repo Git Commit Analysis Script
 * Analyzes git history from multiple repos (local paths or URLs)
 * Perfect for when you've migrated from separate repos to a monorepo!
 *
 * Usage:
 *   bun run scripts/analyze-commits-multi.ts [repo1] [repo2] [repo3]
 *
 * Examples:
 *   bun run scripts/analyze-commits-multi.ts . ~/old-projects/subbengine-api
 *   bun run scripts/analyze-commits-multi.ts https://github.com/user/old-repo .
 */

import { execSync } from 'child_process';
import { existsSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

interface Commit {
  hash: string;
  date: Date;
  author: string;
  message: string;
  hour: number;
  dayOfWeek: string;
  type: string;
  repo: string;
}

interface Stats {
  totalCommits: number;
  dateRange: { start: Date; end: Date };
  morningCommits: number;
  dayCommits: number;
  eveningCommits: number;
  nightCommits: number;
  commitsByHour: Record<number, number>;
  commitsByDay: Record<string, number>;
  commitTypes: Record<string, number>;
  commitsByRepo: Record<string, number>;
  averageCommitsPerDay: number;
  longestStreak: number;
}

function isGitUrl(path: string): boolean {
  return path.startsWith('http://') ||
         path.startsWith('https://') ||
         path.startsWith('git@');
}

function getRepoName(path: string): string {
  if (isGitUrl(path)) {
    const match = path.match(/\/([^\/]+?)(\.git)?$/);
    return match ? match[1] : 'remote-repo';
  }
  return path === '.' ? 'current' : path.split('/').pop() || 'unknown';
}

function cloneRepo(url: string): string {
  const tmpDir = mkdtempSync(join(tmpdir(), 'git-analysis-'));
  console.log(`📥 Cloning ${url}...`);
  try {
    execSync(`git clone --quiet "${url}" "${tmpDir}"`, { stdio: 'pipe' });
    return tmpDir;
  } catch (error) {
    console.error(`❌ Failed to clone ${url}`);
    throw error;
  }
}

function getGitCommits(repoPath: string, repoName: string): Commit[] {
  const originalDir = process.cwd();
  let tempDir: string | null = null;

  try {
    // Handle remote URLs
    if (isGitUrl(repoPath)) {
      tempDir = cloneRepo(repoPath);
      repoPath = tempDir;
    }

    // Change to repo directory
    process.chdir(repoPath);

    // Verify it's a git repo
    if (!existsSync('.git')) {
      throw new Error(`${repoPath} is not a git repository`);
    }

    const gitLog = execSync(
      'git log --pretty=format:"%H|%ad|%an|%s" --date=iso --all --author-date-order',
      { encoding: 'utf-8' }
    );

    const commits: Commit[] = gitLog
      .trim()
      .split('\n')
      .filter(line => line && !line.includes('Turbobot') && !line.includes('bot'))
      .map(line => {
        const [hash, dateStr, author, message] = line.split('|');
        const date = new Date(dateStr);
        const hour = date.getHours();
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

        const typeMatch = message.match(/^(feat|fix|refactor|docs|test|chore|style|perf):/i);
        const type = typeMatch ? typeMatch[1].toLowerCase() : 'other';

        return { hash, date, author, message, hour, dayOfWeek, type, repo: repoName };
      });

    return commits;
  } finally {
    // Always change back and cleanup
    process.chdir(originalDir);
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

function analyzeCommits(commits: Commit[]): Stats {
  const stats: Stats = {
    totalCommits: commits.length,
    dateRange: {
      start: new Date(Math.min(...commits.map(c => c.date.getTime()))),
      end: new Date(Math.max(...commits.map(c => c.date.getTime()))),
    },
    morningCommits: 0,
    dayCommits: 0,
    eveningCommits: 0,
    nightCommits: 0,
    commitsByHour: {},
    commitsByDay: {},
    commitTypes: {},
    commitsByRepo: {},
    averageCommitsPerDay: 0,
    longestStreak: 0,
  };

  for (let i = 0; i < 24; i++) {
    stats.commitsByHour[i] = 0;
  }

  commits.forEach(commit => {
    const hour = commit.hour;

    if (hour >= 5 && hour < 9) stats.morningCommits++;
    else if (hour >= 9 && hour < 17) stats.dayCommits++;
    else if (hour >= 17 && hour < 24) stats.eveningCommits++;
    else stats.nightCommits++;

    stats.commitsByHour[hour]++;
    stats.commitsByDay[commit.dayOfWeek] = (stats.commitsByDay[commit.dayOfWeek] || 0) + 1;
    stats.commitTypes[commit.type] = (stats.commitTypes[commit.type] || 0) + 1;
    stats.commitsByRepo[commit.repo] = (stats.commitsByRepo[commit.repo] || 0) + 1;
  });

  const daysDiff = Math.ceil(
    (stats.dateRange.end.getTime() - stats.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
  );
  stats.averageCommitsPerDay = stats.totalCommits / (daysDiff || 1);

  const commitDates = commits.map(c => c.date.toDateString());
  const uniqueDates = [...new Set(commitDates)].sort();
  stats.longestStreak = calculateStreak(uniqueDates);

  return stats;
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
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

function printStats(stats: Stats, commits: Commit[], repos: string[]) {
  console.log('\n📊 MULTI-REPO GIT COMMIT ANALYSIS\n');
  console.log('='.repeat(60));

  console.log('\n📁 ANALYZED REPOSITORIES');
  repos.forEach(repo => {
    const repoName = getRepoName(repo);
    const count = stats.commitsByRepo[repoName] || 0;
    console.log(`   ${repoName}: ${count} commits`);
  });

  console.log('\n📅 PROJECT TIMELINE (Complete History)');
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
    const bar = '█'.repeat(Math.ceil(count / 2));
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
        feat: '✨', fix: '🐛', refactor: '♻️', docs: '📝',
        test: '✅', chore: '🔧', style: '💄', perf: '⚡', other: '📦'
      }[type] || '📦';
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`   ${emoji} ${type.padEnd(10)} ${bar} ${count}`);
    });

  console.log('\n📝 RECENT COMMIT MESSAGES (The journey)');
  commits.slice(0, 15).forEach(commit => {
    const time = commit.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = commit.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    console.log(`   ${date} ${time} [${commit.repo}] ${commit.message}`);
  });

  console.log('\n💡 BLOG POST INSIGHTS');
  console.log(`   • ${stats.morningCommits} commits before 9 AM - that's dedication!`);
  console.log(`   • Peak coding hour: ${Object.entries(stats.commitsByHour).sort(([,a], [,b]) => b - a)[0][0]}:00`);
  console.log(`   • Most productive day: ${Object.entries(stats.commitsByDay).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}`);
  console.log(`   • Feature commits: ${stats.commitTypes.feat || 0}, Bug fixes: ${stats.commitTypes.fix || 0}`);
  console.log(`   • Project duration: ${Math.ceil((stats.dateRange.end.getTime() - stats.dateRange.start.getTime()) / (1000 * 60 * 60 * 24))} days`);

  console.log('\n' + '='.repeat(60));
}

function generateJSONOutput(stats: Stats, commits: Commit[], repos: string[]) {
  return {
    metadata: {
      analyzedRepos: repos.map(r => getRepoName(r)),
      generatedAt: new Date().toISOString(),
    },
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
    commitsByRepo: stats.commitsByRepo,
    commits: commits.slice(0, 50).map(c => ({
      hash: c.hash.substring(0, 7),
      date: c.date.toISOString(),
      message: c.message,
      hour: c.hour,
      type: c.type,
      repo: c.repo,
    })),
  };
}

// Main execution
try {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📖 Usage: bun run scripts/analyze-commits-multi.ts [repo1] [repo2] ...

Examples:
  # Analyze current repo only
  bun run scripts/analyze-commits-multi.ts .

  # Analyze current repo + old local repo
  bun run scripts/analyze-commits-multi.ts . ~/old-projects/subbengine-api

  # Analyze current repo + remote repo
  bun run scripts/analyze-commits-multi.ts . https://github.com/user/old-repo

  # Analyze multiple old repos
  bun run scripts/analyze-commits-multi.ts ~/api ~/frontend ~/consumer

🎯 This will combine all commits and give you the REAL stats for your blog post!
    `);
    process.exit(0);
  }

  console.log('🔍 Analyzing git history from multiple repositories...\n');

  const repos = args;
  let allCommits: Commit[] = [];

  for (const repo of repos) {
    try {
      console.log(`\n📂 Processing: ${repo}`);
      const commits = getGitCommits(repo, getRepoName(repo));
      console.log(`   ✅ Found ${commits.length} commits`);
      allCommits = allCommits.concat(commits);
    } catch (error) {
      console.error(`   ❌ Error analyzing ${repo}:`, error instanceof Error ? error.message : error);
    }
  }

  if (allCommits.length === 0) {
    console.error('\n❌ No commits found in any repository');
    process.exit(1);
  }

  // Sort all commits by date (newest first)
  allCommits.sort((a, b) => b.date.getTime() - a.date.getTime());

  const stats = analyzeCommits(allCommits);
  printStats(stats, allCommits, repos);

  const jsonOutput = generateJSONOutput(stats, allCommits, repos);
  await Bun.write('commit-analysis.json', JSON.stringify(jsonOutput, null, 2));
  console.log('\n💾 Saved complete analysis to commit-analysis.json');
  console.log('🎨 Run: bun run scripts/generate-visualizations.ts');
  console.log('   to regenerate charts with the complete data!\n');

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
