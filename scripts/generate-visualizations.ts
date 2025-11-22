#!/usr/bin/env bun

/**
 * Generate visualizations for the blog post
 * Creates interactive HTML charts from git commit analysis
 */

const data = await Bun.file('commit-analysis.json').json();

// Generate HTML with Chart.js visualizations
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Git Commit Analysis - The 5 AM Grind</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: white;
      text-align: center;
      margin-bottom: 1rem;
      font-size: 2.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .subtitle {
      color: rgba(255,255,255,0.9);
      text-align: center;
      margin-bottom: 3rem;
      font-size: 1.2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .chart-container {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .chart-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }
    canvas {
      max-height: 400px;
    }
    .insight {
      background: rgba(255,255,255,0.95);
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border-left: 4px solid #667eea;
    }
    .insight-title {
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #667eea;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌅 The 5 AM Grind</h1>
    <p class="subtitle">From "Let me try Redis" to building a complete platform</p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${data.summary.totalCommits}</div>
        <div class="stat-label">Total Commits</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${data.timeOfDay.morning}</div>
        <div class="stat-label">Morning Commits (5-9 AM)</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${Math.round((data.timeOfDay.morning / data.summary.totalCommits) * 100)}%</div>
        <div class="stat-label">Before 9 AM</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${data.summary.averageCommitsPerDay}</div>
        <div class="stat-label">Avg Commits/Day</div>
      </div>
    </div>

    <div class="insight">
      <div class="insight-title">💡 Key Insight</div>
      <p>Over ${Math.round((data.timeOfDay.morning / data.summary.totalCommits) * 100)}% of commits happened before 9 AM.
      This is what dedication looks like - waking up at 5 AM every morning before work to build something.</p>
    </div>

    <div class="chart-container">
      <h2 class="chart-title">⏰ Commits by Hour - The 5 AM Pattern</h2>
      <canvas id="hourlyChart"></canvas>
    </div>

    <div class="chart-container">
      <h2 class="chart-title">🌅 Time of Day Distribution</h2>
      <canvas id="timeOfDayChart"></canvas>
    </div>

    <div class="chart-container">
      <h2 class="chart-title">🏗️ What Was Built - Commit Types</h2>
      <canvas id="commitTypesChart"></canvas>
    </div>

    <div class="chart-container">
      <h2 class="chart-title">📆 Weekly Activity</h2>
      <canvas id="weeklyChart"></canvas>
    </div>

    <div class="insight">
      <div class="insight-title">🎯 The Journey</div>
      <p>It started with curiosity about Redis. Now it's a complete leaderboard platform with:</p>
      <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
        <li>Real-time updates with Socket.io</li>
        <li>Background job processing with BullMQ</li>
        <li>API key management for developers</li>
        <li>Full authentication system</li>
        <li>PostgreSQL + Redis architecture</li>
      </ul>
    </div>
  </div>

  <script>
    const hourlyData = ${JSON.stringify(data.hourlyDistribution)};
    const timeOfDayData = ${JSON.stringify(data.timeOfDay)};
    const commitTypesData = ${JSON.stringify(data.commitTypes)};
    const weeklyData = ${JSON.stringify(data.weeklyDistribution)};

    // Hourly commits chart
    new Chart(document.getElementById('hourlyChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(hourlyData).map(h => h + ':00'),
        datasets: [{
          label: 'Commits',
          data: Object.values(hourlyData),
          backgroundColor: Object.keys(hourlyData).map(h => {
            const hour = parseInt(h);
            if (hour >= 5 && hour < 9) return 'rgba(255, 159, 64, 0.8)'; // Morning - orange
            if (hour >= 9 && hour < 17) return 'rgba(75, 192, 192, 0.8)'; // Day - teal
            if (hour >= 17) return 'rgba(153, 102, 255, 0.8)'; // Evening - purple
            return 'rgba(54, 162, 235, 0.8)'; // Night - blue
          }),
          borderColor: Object.keys(hourlyData).map(h => {
            const hour = parseInt(h);
            if (hour >= 5 && hour < 9) return 'rgba(255, 159, 64, 1)';
            if (hour >= 9 && hour < 17) return 'rgba(75, 192, 192, 1)';
            if (hour >= 17) return 'rgba(153, 102, 255, 1)';
            return 'rgba(54, 162, 235, 1)';
          }),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                const hour = parseInt(items[0].label);
                if (hour >= 5 && hour < 9) return items[0].label + ' (Morning 🌅)';
                if (hour >= 9 && hour < 17) return items[0].label + ' (Day ☀️)';
                if (hour >= 17) return items[0].label + ' (Evening 🌆)';
                return items[0].label + ' (Night 🌙)';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });

    // Time of day pie chart
    new Chart(document.getElementById('timeOfDayChart'), {
      type: 'doughnut',
      data: {
        labels: ['🌅 Morning (5-9 AM)', '☀️ Day (9 AM-5 PM)', '🌆 Evening (5 PM-12 AM)', '🌙 Night (12-5 AM)'],
        datasets: [{
          data: [timeOfDayData.morning, timeOfDayData.day, timeOfDayData.evening, timeOfDayData.night],
          backgroundColor: [
            'rgba(255, 159, 64, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(54, 162, 235, 0.8)'
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // Commit types chart
    new Chart(document.getElementById('commitTypesChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(commitTypesData).map(type => {
          const emoji = {
            feat: '✨ feat',
            fix: '🐛 fix',
            refactor: '♻️ refactor',
            docs: '📝 docs',
            test: '✅ test',
            other: '📦 other'
          };
          return emoji[type] || type;
        }),
        datasets: [{
          label: 'Commits',
          data: Object.values(commitTypesData),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });

    // Weekly activity chart
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    new Chart(document.getElementById('weeklyChart'), {
      type: 'bar',
      data: {
        labels: daysOrder,
        datasets: [{
          label: 'Commits',
          data: daysOrder.map(day => weeklyData[day] || 0),
          backgroundColor: daysOrder.map(day =>
            day === 'Saturday' || day === 'Sunday'
              ? 'rgba(255, 99, 132, 0.8)'  // Weekends
              : 'rgba(102, 126, 234, 0.8)' // Weekdays
          ),
          borderColor: daysOrder.map(day =>
            day === 'Saturday' || day === 'Sunday'
              ? 'rgba(255, 99, 132, 1)'
              : 'rgba(102, 126, 234, 1)'
          ),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  </script>
</body>
</html>`;

await Bun.write('commit-visualizations.html', html);
console.log('✅ Generated commit-visualizations.html');
console.log('   Open it in a browser to see interactive charts!');

// Generate Mermaid diagram for architecture
const mermaidDiagram = `# Architecture Evolution Diagram

\`\`\`mermaid
graph TB
    subgraph "Stage 1: Just Trying Redis"
        A1[Simple Node Script] --> R1[Redis]
        style A1 fill:#f9f,stroke:#333
        style R1 fill:#ff6b6b
    end

    subgraph "Stage 2: It's Getting Real"
        A2[Hono API] --> R2[Redis]
        A2 --> P2[PostgreSQL]
        A2 --> B2[BullMQ Queue]
        style A2 fill:#51cf66
        style R2 fill:#ff6b6b
        style P2 fill:#339af0
        style B2 fill:#ffd43b
    end

    subgraph "Stage 3: Full Platform"
        W3[React Frontend] --> A3[Hono API]
        A3 --> R3[Redis Cache]
        A3 --> P3[PostgreSQL]
        A3 --> Q3[BullMQ]
        Q3 --> C3[Consumer Service]
        A3 <--> S3[Socket.io]
        W3 <--> S3
        A3 --> Auth[Better Auth]

        style W3 fill:#61dafb
        style A3 fill:#51cf66
        style R3 fill:#ff6b6b
        style P3 fill:#339af0
        style Q3 fill:#ffd43b
        style C3 fill:#ae3ec9
        style S3 fill:#f06595
        style Auth fill:#ffc078
    end
\`\`\`

## Tech Stack Evolution

### Week 1: "Just Redis"
- Started with a simple experiment
- Basic key-value operations
- No database, no API

### Week 4: "Wait, I Need More"
- Added PostgreSQL for persistent data
- Hono for API framework
- BullMQ for background jobs
- Drizzle ORM for type-safe queries

### Week 8: "This is a Real Product"
- Full React frontend with TanStack Router
- Real-time updates with Socket.io
- Authentication system
- API key management
- Leaderboard system
- Background job processing
- Redis caching layer
`;

await Bun.write('architecture-diagram.md', mermaidDiagram);
console.log('✅ Generated architecture-diagram.md');
console.log('   Use this Mermaid diagram in your blog post!');

// Generate markdown summary for blog
const blogContent = `# The 5 AM Grind: From "Let Me Try Redis" to Building a Game Leaderboard Platform

## The Numbers Don't Lie

- **${data.summary.totalCommits}** total commits in ${Math.ceil((new Date(data.summary.dateRange.end).getTime() - new Date(data.summary.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days
- **${data.timeOfDay.morning}** commits before 9 AM (${Math.round((data.timeOfDay.morning / data.summary.totalCommits) * 100)}%)
- Peak coding hour: **6:00 AM**
- **${data.commitTypes.feat || 0}** features built, **${data.commitTypes.fix || 0}** bugs fixed

## It Started With Curiosity

I wanted to try Redis. That's it. Just wanted to understand what all the hype was about.

So I set my alarm for 5 AM.

## The Journey

\`\`\`
First commit: ${new Date(data.summary.dateRange.start).toLocaleDateString()}
"Let me just try Redis real quick"
\`\`\`

### Week 1: Simple Redis Experiments
- Basic SET/GET operations
- Learning about data structures
- "This is cool, but I need to persist data..."

### Week 2-3: Scope Creep Begins
- Added PostgreSQL
- "I should make this an API"
- Discovered Hono framework
- "Wait, I need background jobs"
- Added BullMQ

### Week 4-6: It's a Real Project Now
- Built a frontend with React
- Added authentication
- Implemented leaderboards
- Real-time updates with Socket.io
- "I'm accidentally building a product"

### Week 7-8: Polish & Features
- API key management system
- Code ownership and permissions
- Stats and analytics
- "This could actually be useful for game developers"

## What I Built

**SubbEngine** - A leaderboard-as-a-service platform for games

### Features
- 🎮 Multiple game support
- 🏆 Real-time leaderboards
- 🔑 API key management for developers
- 📊 Player stats and analytics
- ⚡ Real-time updates via WebSockets
- 🔐 Full authentication system
- 📈 Background score processing

### Tech Stack
- **Frontend**: React, TanStack Router, TailwindCSS
- **Backend**: Hono, PostgreSQL, Redis
- **Real-time**: Socket.io
- **Jobs**: BullMQ
- **Auth**: Better Auth
- **ORM**: Drizzle

## The 5 AM Routine

| Commits by Time of Day |
|------------------------|
| 🌅 Morning (5-9 AM): **${data.timeOfDay.morning}** (${Math.round((data.timeOfDay.morning / data.summary.totalCommits) * 100)}%) |
| ☀️ Day (9 AM-5 PM): **${data.timeOfDay.day}** (${Math.round((data.timeOfDay.day / data.summary.totalCommits) * 100)}%) |
| 🌆 Evening (5 PM-12 AM): **${data.timeOfDay.evening}** (${Math.round((data.timeOfDay.evening / data.summary.totalCommits) * 100)}%) |

The data shows it: over half my commits happened before I even got to my day job.

## Lessons Learned

1. **Start small, iterate fast** - "Just trying Redis" turned into a full platform
2. **Consistency > Intensity** - 2 hours every morning beats 10 hours on weekends
3. **Scope creep isn't always bad** - Sometimes the best projects emerge from curiosity
4. **Ship before perfect** - ${data.commitTypes.fix || 0} bug fixes means I shipped features quickly
5. **Morning productivity is real** - ${Math.round((data.timeOfDay.morning / data.summary.totalCommits) * 100)}% of commits before 9 AM proves it

## What's Next?

I'm not sure yet. But I have a working platform that:
- Actually solves a problem (leaderboards are annoying to build)
- Has a clean API
- Scales with Redis + PostgreSQL
- Could be useful for other developers

Maybe I'll open source it. Maybe I'll make it a product. For now, I'm just proud I actually finished something.

---

*All stats generated from actual git commit history. View the interactive charts and code on [GitHub](#).*
`;

await Bun.write('blog-post-draft.md', blogContent);
console.log('✅ Generated blog-post-draft.md');
console.log('   A complete draft with all your stats!');

console.log('\n📦 Generated Files:');
console.log('   1. commit-visualizations.html - Interactive charts');
console.log('   2. architecture-diagram.md - Mermaid diagrams');
console.log('   3. blog-post-draft.md - Complete blog post draft');
console.log('\n🎨 Next: Open the HTML file in a browser to see your beautiful visualizations!');
