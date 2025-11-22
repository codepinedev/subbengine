#!/usr/bin/env bun

/**
 * Deep dive into morning coding patterns
 * Let's see the REAL story in the data
 */

const data = await Bun.file('commit-analysis.json').json();

console.log('\n🔍 DEEP DIVE: Morning Coding Analysis\n');
console.log('='.repeat(60));

// Analyze commits by time ranges
const commits = data.commits;

const morningCommits = commits.filter(c => {
  const hour = c.hour;
  return hour >= 5 && hour < 9;
});

const realEarlyMorning = commits.filter(c => c.hour >= 5 && c.hour < 7);
const earlyMorning = commits.filter(c => c.hour >= 7 && c.hour < 9);

console.log('\n⏰ MORNING COMMIT BREAKDOWN');
console.log(`   5-7 AM (Real early): ${realEarlyMorning.length} commits`);
console.log(`   7-9 AM (Early): ${earlyMorning.length} commits`);
console.log(`   Total before 9 AM: ${morningCommits.length} commits`);

// Group by week to see trends
console.log('\n📈 MORNING COMMITS TREND OVER TIME');
const commitsByWeek = new Map<string, { morning: number; total: number }>();

commits.forEach(c => {
  const date = new Date(c.date);
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay()); // Start of week
  const weekKey = weekStart.toISOString().split('T')[0];

  if (!commitsByWeek.has(weekKey)) {
    commitsByWeek.set(weekKey, { morning: 0, total: 0 });
  }

  const week = commitsByWeek.get(weekKey)!;
  week.total++;
  if (c.hour >= 5 && c.hour < 9) {
    week.morning++;
  }
});

const sortedWeeks = Array.from(commitsByWeek.entries()).sort(([a], [b]) => a.localeCompare(b));

sortedWeeks.forEach(([week, stats]) => {
  const percentage = ((stats.morning / stats.total) * 100).toFixed(0);
  const bar = '█'.repeat(Math.ceil(stats.morning / 2));
  console.log(`   Week of ${week}: ${bar} ${stats.morning}/${stats.total} (${percentage}%)`);
});

// Days with ONLY morning commits
const commitsByDate = new Map<string, number[]>();
commits.forEach(c => {
  const date = new Date(c.date).toISOString().split('T')[0];
  if (!commitsByDate.has(date)) {
    commitsByDate.set(date, []);
  }
  commitsByDate.get(date)!.push(c.hour);
});

const morningOnlyDays = Array.from(commitsByDate.entries()).filter(([_, hours]) => {
  return hours.every(h => h >= 5 && h < 9);
});

console.log('\n🌅 PURE MORNING CODING DAYS');
console.log(`   Days with ONLY morning commits: ${morningOnlyDays.length}`);
console.log(`   Total coding days: ${commitsByDate.size}`);
console.log(`   Percentage: ${((morningOnlyDays.length / commitsByDate.size) * 100).toFixed(1)}%`);

// Show those pure morning days
if (morningOnlyDays.length > 0) {
  console.log('\n   Pure morning coding sessions:');
  morningOnlyDays.slice(0, 10).forEach(([date, hours]) => {
    console.log(`     ${date}: ${hours.length} commits at ${hours.join(', ')}:00`);
  });
}

// Analyze what was built in the morning vs other times
const morningFeats = morningCommits.filter(c => c.type === 'feat').length;
const morningFixes = morningCommits.filter(c => c.type === 'fix').length;
const totalFeats = commits.filter(c => c.type === 'feat').length;
const totalFixes = commits.filter(c => c.type === 'fix').length;

console.log('\n🏗️  MORNING PRODUCTIVITY');
console.log(`   Features built in morning: ${morningFeats}/${totalFeats} (${((morningFeats/totalFeats)*100).toFixed(1)}%)`);
console.log(`   Bugs fixed in morning: ${morningFixes}/${totalFixes} (${((morningFixes/totalFixes)*100).toFixed(1)}%)`);

// Peak morning productivity
console.log('\n⭐ PEAK MORNING HOUR');
const morningHours = { 5: 0, 6: 0, 7: 0, 8: 0 };
commits.forEach(c => {
  if (c.hour >= 5 && c.hour < 9) {
    morningHours[c.hour]++;
  }
});

Object.entries(morningHours).forEach(([hour, count]) => {
  const bar = '█'.repeat(Math.ceil(count / 2));
  console.log(`   ${hour}:00 AM ${bar} ${count} commits`);
});

console.log('\n💡 NARRATIVE SUGGESTIONS');
console.log('\nBased on the actual data, here are honest stories you can tell:\n');

if (realEarlyMorning.length > 10) {
  console.log(`✓ "${realEarlyMorning.length} commits before 7 AM shows serious dedication"`);
}

if (morningOnlyDays.length > 5) {
  console.log(`✓ "${morningOnlyDays.length} days of pure morning coding sessions before work"`);
}

const peakHour = Object.entries(morningHours).sort(([,a], [,b]) => b - a)[0];
if (peakHour[1] > 10) {
  console.log(`✓ "Peak productivity at ${peakHour[0]}:00 AM with ${peakHour[1]} commits"`);
}

if (data.timeOfDay.morning > data.timeOfDay.evening) {
  console.log(`✓ "More commits before 9 AM than in the evening - morning person confirmed"`);
}

console.log(`✓ "Weekends show real dedication: ${data.weeklyDistribution.Saturday + data.weeklyDistribution.Sunday} commits"`);

console.log('\n🎯 THE REAL STORY');
console.log('\nInstead of "I woke up at 5 AM every single day", the data shows:');
console.log(`- Committed to morning coding sessions (${morningOnlyDays.length} pure morning days)`);
console.log(`- Peak productivity at ${peakHour[0]}:00 AM`);
console.log(`- Built ${morningFeats} features during morning sessions`);
console.log(`- Consistent dedication: weekends included (${data.weeklyDistribution.Saturday + data.weeklyDistribution.Sunday} commits)`);
console.log(`- ${commits.length} commits over ${Math.ceil((new Date(data.summary.dateRange.end).getTime() - new Date(data.summary.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days = real consistency`);

console.log('\n' + '='.repeat(60));
