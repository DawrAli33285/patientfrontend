import React, { useState, useEffect } from 'react';
import { Users, FileText, Download, Upload, Activity, Database } from 'lucide-react';
import { BASE_URL } from './baseurl';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: { count: 0, growth: 0 },
    activeUsers: { count: 0, growth: 0 },
    totalFiles: { count: 0, growth: 0 },
    storageUsed: { size: '0.00', growth: 0 }
  });
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/dashboard/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setMonthlyGrowth(data.monthlyGrowth);
        setRecentActivity(data.recentActivity);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (e) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const getActivityIcon = (action) => {
    if (action.includes('Upload')) return { icon: Upload, bg: '#dbeafe', color: '#2563eb' };
    if (action.includes('Download')) return { icon: Download, bg: '#dcfce7', color: '#16a34a' };
    return { icon: Users, bg: '#f3e8ff', color: '#9333ea' };
  };

  const s = {
    // Page
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #eff6ff 50%, #faf5ff 100%)', padding: '32px', fontFamily: 'sans-serif' },
    inner: { maxWidth: '1280px', margin: '0 auto' },

    // Loading / Error screens
    centered: { minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb, #eff6ff, #faf5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' },
    loadingCard: { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center' },
    spinner: { display: 'inline-block', width: '64px', height: '64px', border: '4px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadingText: { marginTop: '24px', color: '#4b5563', fontSize: '17px', fontWeight: '500' },
    errorCard: { backgroundColor: '#fef2f2', border: '2px solid #fecaca', borderRadius: '16px', padding: '32px', maxWidth: '400px' },
    errorText: { color: '#dc2626', fontSize: '17px', marginBottom: '16px' },
    errorBtn: { width: '100%', backgroundColor: '#dc2626', color: '#fff', padding: '12px', border: 'none', borderRadius: '12px', fontWeight: '500', cursor: 'pointer', fontSize: '15px' },

    // Header
    header: { marginBottom: '40px' },
    headerRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
    headerAccent: { width: '8px', height: '32px', background: 'linear-gradient(180deg, #2563eb, #9333ea)', borderRadius: '9999px', flexShrink: 0 },
    headerTitle: { fontSize: '36px', fontWeight: '800', background: 'linear-gradient(90deg, #111827, #4b5563)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    headerSubtitle: { color: '#4b5563', fontSize: '17px', marginLeft: '20px', marginTop: '4px' },

    // Stats grid
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' },

    // Stat card
    statCard: { position: 'relative', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', overflow: 'hidden', padding: '24px' },
    statCardBlob: (color) => ({ position: 'absolute', top: '-64px', right: '-64px', width: '128px', height: '128px', borderRadius: '50%', background: color, opacity: 0.12, pointerEvents: 'none' }),
    statIconBox: (bg) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '12px', background: bg, boxShadow: '0 2px 6px rgba(0,0,0,0.12)', marginBottom: '16px', color: '#fff' }),
    statTitle: { fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#111827', margin: 0 },

    // Two-col grid
    twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' },

    // Panel card
    panel: { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', padding: '32px' },
    panelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
    panelTitle: { fontSize: '19px', fontWeight: '700', color: '#111827', margin: 0 },

    // Legend
    legend: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' },
    legendDot: (color) => ({ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }),
    legendLabel: { color: '#4b5563' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '6px' },

    // Chart rows
    chartRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
    chartMonth: { fontSize: '13px', fontWeight: '600', color: '#374151', width: '36px', flexShrink: 0 },
    chartBars: { flex: 1 },
    barTrack: { backgroundColor: '#f3f4f6', borderRadius: '9999px', height: '10px', overflow: 'hidden', marginBottom: '6px', position: 'relative' },
    barFillBlue: (pct) => ({ height: '10px', borderRadius: '9999px', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', width: `${pct}%`, transition: 'width 0.5s ease' }),
    barFillPurple: (pct) => ({ height: '10px', borderRadius: '9999px', background: 'linear-gradient(90deg, #a855f7, #9333ea)', width: `${pct}%`, transition: 'width 0.5s ease' }),
    barLabel: { fontSize: '11px', fontWeight: '500', color: '#4b5563', textAlign: 'right', marginBottom: '2px' },

    // Activity list
    activityItem: { display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px', borderRadius: '12px', marginBottom: '8px' },
    activityIconBox: (bg) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '12px', backgroundColor: bg, flexShrink: 0 }),
    activityContent: { flex: 1, minWidth: 0 },
    activityEmail: { fontSize: '13px', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    activityAction: { fontSize: '12px', color: '#6b7280', marginTop: '2px' },
    activityTime: { fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 },

    emptyText: { textAlign: 'center', color: '#6b7280', padding: '32px 0', fontSize: '14px' },
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={s.centered}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={s.loadingCard}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={s.centered}>
        <div style={s.errorCard}>
          <p style={s.errorText}>{error}</p>
          <button onClick={fetchDashboardData} style={s.errorBtn}>Try Again</button>
        </div>
      </div>
    );
  }

  const maxUsers = Math.max(...monthlyGrowth.map(m => m.users), 1);
  const maxFiles = Math.max(...monthlyGrowth.map(m => m.files), 1);

  const statCards = [
    { icon: Users,    title: 'Total Users',    value: stats.totalUsers.count,           blob: '#3b82f6', iconBg: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
    { icon: Activity, title: 'Active Users',   value: stats.activeUsers.count,          blob: '#22c55e', iconBg: 'linear-gradient(135deg,#22c55e,#16a34a)' },
    { icon: FileText, title: 'Total Files',    value: stats.totalFiles.count,           blob: '#a855f7', iconBg: 'linear-gradient(135deg,#a855f7,#9333ea)' },
    { icon: Database, title: 'Storage Used',   value: `${stats.storageUsed.size}MB`,    blob: '#f97316', iconBg: 'linear-gradient(135deg,#f97316,#ea580c)' },
  ];

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div style={s.inner}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerRow}>
            <div style={s.headerAccent} />
            <h1 style={s.headerTitle}>Dashboard</h1>
          </div>
          <p style={s.headerSubtitle}>Welcome back! Here's your system overview.</p>
        </div>

        {/* Stat Cards */}
        <div style={s.statsGrid}>
          {statCards.map(({ icon: Icon, title, value, blob, iconBg }) => (
            <div key={title} style={s.statCard}>
              <div style={s.statCardBlob(blob)} />
              <div style={s.statIconBox(iconBg)}><Icon size={24} /></div>
              <p style={s.statTitle}>{title}</p>
              <p style={s.statValue}>{value}</p>
            </div>
          ))}
        </div>

        {/* Charts + Activity */}
        <div style={s.twoCol}>
          {/* Monthly Growth */}
          <div style={s.panel}>
            <div style={s.panelHeader}>
              <h3 style={s.panelTitle}>Monthly Growth</h3>
              <div style={s.legend}>
                <div style={s.legendItem}>
                  <div style={s.legendDot('#3b82f6')} />
                  <span style={s.legendLabel}>Users</span>
                </div>
                <div style={s.legendItem}>
                  <div style={s.legendDot('#a855f7')} />
                  <span style={s.legendLabel}>Files</span>
                </div>
              </div>
            </div>

            {monthlyGrowth.length === 0 ? (
              <p style={s.emptyText}>No data available</p>
            ) : (
              monthlyGrowth.map((stat, idx) => (
                <div key={idx} style={s.chartRow}>
                  <span style={s.chartMonth}>{stat.month}</span>
                  <div style={s.chartBars}>
                    <p style={s.barLabel}>{stat.users}</p>
                    <div style={s.barTrack}>
                      <div style={s.barFillBlue(Math.min((stat.users / maxUsers) * 100, 100))} />
                    </div>
                    <p style={s.barLabel}>{stat.files}</p>
                    <div style={s.barTrack}>
                      <div style={s.barFillPurple(Math.min((stat.files / maxFiles) * 100, 100))} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Activity */}
          <div style={s.panel}>
            <div style={s.panelHeader}>
              <h3 style={s.panelTitle}>Recent Activity</h3>
            </div>

            {recentActivity.length === 0 ? (
              <p style={s.emptyText}>No recent activity</p>
            ) : (
              recentActivity.map((activity, idx) => {
                const { icon: Icon, bg, color } = getActivityIcon(activity.action);
                return (
                  <div key={idx} style={s.activityItem}>
                    <div style={s.activityIconBox(bg)}>
                      <Icon size={16} color={color} />
                    </div>
                    <div style={s.activityContent}>
                      <p style={s.activityEmail}>{activity.email}</p>
                      <p style={s.activityAction}>{activity.action}</p>
                    </div>
                    <span style={s.activityTime}>{getTimeAgo(activity.time)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}