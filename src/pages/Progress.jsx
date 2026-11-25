import React from 'react';
import { useApp } from '../context/AppContext';
import './Progress.css';

function Progress() {
  const { getProgressData, masterTasks } = useApp();
  const data = getProgressData();

  const totalTasks = masterTasks.length;
  const totalDays = data.length;
  const avgPct = totalDays ? Math.round(data.reduce((sum, d) => sum + d.pct, 0) / totalDays) : 0;
  const bestDay = data.length ? data.reduce((best, d) => d.pct > best.pct ? d : best, data[0]) : null;
  const streak = computeStreak(data);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Progress</h1>
          <p className="page-subtitle">Track your productivity over time</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="progress-stats-cards">
        <StatCard icon="📋" label="Total Tasks" value={totalTasks} sub="in library" color="#3b82f6" />
        <StatCard icon="📅" label="Days Tracked" value={totalDays} sub="active days" color="#10b981" />
        <StatCard icon="📊" label="Avg Completion" value={`${avgPct}%`} sub="per day" color="#8b5cf6" />
        <StatCard icon="🔥" label="Current Streak" value={streak} sub="days in a row" color="#f59e0b" />
        {bestDay && (
          <StatCard icon="🏆" label="Best Day" value={`${bestDay.pct}%`} sub={formatDate(bestDay.date)} color="#ef4444" />
        )}
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h3>No progress data yet</h3>
          <p>Add tasks to your daily plan and complete them to start seeing your productivity graph here.</p>
        </div>
      ) : (
        <>
          <div className="progress-chart-card">
            <h2 className="chart-title">Daily Completion Rate</h2>
            <BarChart data={data} />
          </div>

          <div className="progress-history-table">
            <h2 className="chart-title">Day-by-Day Breakdown</h2>
            <div className="progress-table-wrap">
              <table className="progress-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Tasks Planned</th>
                    <th>Completed</th>
                    <th>Rate</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data].reverse().map((row) => (
                    <tr key={row.date}>
                      <td>{formatDate(row.date)}</td>
                      <td>{row.total}</td>
                      <td>{row.completed}</td>
                      <td>
                        <span className={`rate-badge ${getRateBadgeClass(row.pct)}`}>
                          {row.pct}%
                        </span>
                      </td>
                      <td>
                        <div className="table-mini-bar">
                          <div className="table-mini-fill" style={{ width: `${row.pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-sub">{sub}</div>
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const displayData = data.slice(-30); // last 30 days

  return (
    <div className="bar-chart">
      <div className="bar-chart-y-axis">
        {[100, 75, 50, 25, 0].map((v) => (
          <span key={v} className="y-label">{v}%</span>
        ))}
      </div>
      <div className="bar-chart-area">
        <div className="bar-chart-grid">
          {[100, 75, 50, 25, 0].map((v) => (
            <div key={v} className="grid-line" style={{ bottom: `${v}%` }} />
          ))}
        </div>
        <div className="bars-container">
          {displayData.map((d) => (
            <div key={d.date} className="bar-col">
              <div className="bar-tooltip">
                <strong>{formatDate(d.date)}</strong>
                <span>{d.completed}/{d.total} tasks — {d.pct}%</span>
              </div>
              <div
                className="bar"
                style={{ height: `${(d.pct / 100) * 100}%` }}
              >
                <div className="bar-inner" style={{ height: '100%' }} />
              </div>
              <span className="bar-label">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function computeStreak(data) {
  if (!data.length) return 0;
  let streak = 0;
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
  let prevDate = null;
  for (const d of sorted) {
    if (d.pct <= 0) break;
    if (prevDate) {
      const diffMs = new Date(prevDate + 'T00:00:00') - new Date(d.date + 'T00:00:00');
      const diffDays = Math.round(diffMs / 86400000);
      if (diffDays !== 1) break;
    }
    streak++;
    prevDate = d.date;
  }
  return streak;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function getRateBadgeClass(pct) {
  if (pct >= 80) return 'rate-excellent';
  if (pct >= 50) return 'rate-good';
  if (pct > 0) return 'rate-low';
  return 'rate-zero';
}

export default Progress;
