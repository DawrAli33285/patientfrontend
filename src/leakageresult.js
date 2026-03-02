import React from 'react';
import { Download, BarChart3, Users, ArrowRightLeft, MapPin, TrendingUp } from 'lucide-react';

export default function LeakageResults({ data, formData, onExport }) {
  if (!data) return null;

  function displayHNMIRange(hnmiPayload) {
    if (!hnmiPayload || !hnmiPayload.hnmi) return 'N/A';
    const { conservative, upper_bound } = hnmiPayload.hnmi;
    return `${conservative.toLocaleString()} - ${upper_bound.toLocaleString()}`;
  }
  
  function displayHNMIExpected(hnmiPayload) {
    if (!hnmiPayload || !hnmiPayload.hnmi) return 'N/A';
    return hnmiPayload.hnmi.expected.toLocaleString();
  }

  return (
    <div style={styles.resultsContainer}>
      {/* Traffic Overview Section */}
      <div style={styles.card}>
        <div style={styles.resultsHeader}>
          <div style={styles.resultsHeaderLeft}>
            <BarChart3 style={styles.resultsIcon} />
            <h2 style={styles.resultsTitle}>Traffic Overview</h2>
          </div>
          <button onClick={onExport} style={styles.exportButton}>
            <Download style={styles.exportIcon} />
            Download CSV
          </button>
        </div>

        <div style={styles.summaryBox}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Analysis Period:</span>
            <span style={styles.summaryValue}>
              {formData.dateRange.start} to {formData.dateRange.end}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Primary Location:</span>
            <span style={styles.summaryValue}>{data.primary.address}</span>
          </div>
          {formData.filters && (formData.filters.dayOfWeek || formData.filters.timeOfDay) && (
            <>
              {formData.filters.dayOfWeek && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Filtered by Day:</span>
                  <span style={styles.summaryValue}>{formData.filters.dayOfWeek}</span>
                </div>
              )}
              {formData.filters.timeOfDay && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Filtered by Time:</span>
                  <span style={styles.summaryValue}>{formData.filters.timeOfDay}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* HNMI Disclaimer */}
        <div style={styles.disclaimerBox}>
          <div style={styles.disclaimerIcon}>ℹ️</div>
          <div style={styles.disclaimerText}>
            <strong>About HNMI:</strong> All signal counts shown are HNMI-normalized behavioral 
            signals and do not represent unique individuals. Values are presented as ranges 
            (conservative to upper bound) to reflect data adjustment factors.
          </div>
        </div>

        {/* KPI Tiles */}
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon}>
              <Users size={24} color="#4f46e5" />
            </div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiLabel}>Primary Location Signals</div>
              <div style={styles.kpiValue}>
                {displayHNMIExpected(data.primary.signals)}
              </div>
              <div style={styles.kpiRange}>
                Range: {displayHNMIRange(data.primary.signals)}
              </div>
            </div>
          </div>

          {data.competitors.slice(0, 3).map((comp, idx) => (
            <div key={idx} style={styles.kpiCard}>
              <div style={styles.kpiIcon}>
                <MapPin size={24} color="#059669" />
              </div>
              <div style={styles.kpiContent}>
                <div style={styles.kpiLabel}>{comp.name}</div>
                <div style={styles.kpiValue}>
                  {displayHNMIExpected(comp.signals)}
                </div>
                <div style={styles.kpiRange}>
                  Range: {displayHNMIRange(comp.signals)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple Trend Chart */}
        {data.trendData && data.trendData.length > 0 && (
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Signals Over Time</h3>
            <div style={styles.simpleChart}>
              {data.trendData.map((point, idx) => {
                const expectedValue = point.signals?.hnmi?.expected || 0;
                const maxValue = Math.max(...data.trendData.map(p => p.signals?.hnmi?.expected || 0));
                const height = maxValue > 0 ? (expectedValue / maxValue) * 100 : 0;
                
                return (
                  <div key={idx} style={styles.chartBar} title={point.signals?.hnmi?.label_text || ''}>
                    <div 
                      style={{
                        ...styles.barFill, 
                        height: `${height}%`,
                        backgroundColor: idx % 2 === 0 ? '#4f46e5' : '#059669'
                      }}
                    />
                    <div style={styles.barLabel}>{point.date}</div>
                    <div style={{fontSize: '0.7rem', color: '#9ca3af'}}>
                      {expectedValue.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Visitor Overlap Section */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
          <Users style={styles.sectionIcon} />
          Signal Overlap Analysis
        </h3>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Location</th>
                <th style={styles.tableHeaderCell}>Behavioral Signals</th>
                <th style={styles.tableHeaderCell}>Shared Signals</th>
                <th style={styles.tableHeaderCell}>Overlap %</th>
                <th style={styles.tableHeaderCell}>Primary Only Signals</th>
                <th style={styles.tableHeaderCell}>Competitor Only Signals</th>
              </tr>
            </thead>
            <tbody>
              {data.competitors.map((comp, idx) => (
                <tr key={idx} style={{
                  ...styles.tableRow, 
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb'
                }}>
                  <td style={styles.tableCell}>
                    <div style={styles.locationCell}>
                      <MapPin size={16} color="#6b7280" />
                      <div>
                        <div style={styles.locationName}>{comp.name}</div>
                        <div style={styles.locationAddress}>{comp.address}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{...styles.tableCell, textAlign: 'center', fontWeight: '600'}}>
                    <div>{displayHNMIExpected(comp.signals)}</div>
                    <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                      {displayHNMIRange(comp.signals)}
                    </div>
                  </td>
                  <td style={{...styles.tableCell, textAlign: 'center', fontWeight: '600'}}>
                    <div>{displayHNMIExpected(comp.sharedSignals)}</div>
                    <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                      {displayHNMIRange(comp.sharedSignals)}
                    </div>
                  </td>
                  <td style={{...styles.tableCell, textAlign: 'center'}}>
                    <span style={{
                      ...styles.percentBadge,
                      backgroundColor: comp.overlapPercent > 20 ? '#fee2e2' : '#dbeafe',
                      color: comp.overlapPercent > 20 ? '#991b1b' : '#1e40af'
                    }}>
                      {comp.overlapPercent}%
                    </span>
                  </td>
                  <td style={{...styles.tableCell, textAlign: 'center'}}>
                    <div>{displayHNMIExpected(comp.primaryOnlySignals)}</div>
                    <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                      {displayHNMIRange(comp.primaryOnlySignals)}
                    </div>
                  </td>
                  <td style={{...styles.tableCell, textAlign: 'center'}}>
                    <div>{displayHNMIExpected(comp.competitorOnlySignals)}</div>
                    <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                      {displayHNMIRange(comp.competitorOnlySignals)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Primary Visitor & Competitor Percentage Card */}
<div style={styles.card}>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
    <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Primary Visitors</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
        {data.primary.signals.hnmi.expected.toLocaleString()}
      </div>
    </div>

    {data.competitors.map((comp, idx) => (
      <div key={idx} style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{comp.name}</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' }}>
          {comp.competitorVisitPercent}%
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>visited this competitor</div>
      </div>
    ))}
  </div>
</div>

      {/* Cross-Visitation Movement Section */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
          <ArrowRightLeft style={styles.sectionIcon} />
          Cross-Visitation Movement
        </h3>
        <p style={styles.helperText}>
          Shows signal movement patterns between your primary location and competitors
        </p>

        <div style={styles.movementGrid}>
          {data.competitors.map((comp, idx) => (
            <div key={idx} style={styles.movementCard}>
              <div style={styles.movementHeader}>
                <MapPin size={18} color="#4f46e5" />
                <span style={styles.movementTitle}>{comp.name}</span>
              </div>
              
              <div style={styles.movementStats}>
                <div style={styles.movementStat}>
                  <div style={styles.movementArrow}>→</div>
                  <div>
                    <div style={styles.movementLabel}>Primary → Competitor</div>
                    <div style={styles.movementValue}>
                      {comp.primaryToCompetitor?.hnmi?.expected != null
                        ? comp.primaryToCompetitor.hnmi.expected.toLocaleString()
                        : 'N/A'}
                    </div>
                    <div style={{fontSize: '0.7rem', color: '#6b7280'}}>
                      {comp.primaryToCompetitor?.hnmi?.label_text
                        ? `Range: ${comp.primaryToCompetitor.hnmi.conservative.toLocaleString()} - ${comp.primaryToCompetitor.hnmi.upper_bound.toLocaleString()}`
                        : ''}
                    </div>
                  </div>
                </div>
                
                <div style={styles.movementStat}>
                  <div style={styles.movementArrow}>←</div>
                  <div>
                    <div style={styles.movementLabel}>Competitor → Primary</div>
                    <div style={styles.movementValue}>
                      {comp.competitorToPrimary?.hnmi?.expected != null
                        ? comp.competitorToPrimary.hnmi.expected.toLocaleString()
                        : 'N/A'}
                    </div>
                    <div style={{fontSize: '0.7rem', color: '#6b7280'}}>
                      {comp.competitorToPrimary?.hnmi?.label_text
                        ? `Range: ${comp.competitorToPrimary.hnmi.conservative.toLocaleString()} - ${comp.competitorToPrimary.hnmi.upper_bound.toLocaleString()}`
                        : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.movementNote}>
              {comp.primaryToCompetitor?.hnmi?.expected != null && 
                 comp.competitorToPrimary?.hnmi?.expected != null ? (
                  comp.primaryToCompetitor.hnmi.expected > comp.competitorToPrimary.hnmi.expected ? (
                    <span style={{color: '#dc2626'}}>
                      ⚠️ More signals leaving for this competitor
                    </span>
                  ) : comp.competitorToPrimary.hnmi.expected > comp.primaryToCompetitor.hnmi.expected ? (
                    <span style={{color: '#059669'}}>
                      ✓ More signals coming from this competitor
                    </span>
                  ) : (
                    <span style={{color: '#6b7280'}}>
                      ⚖️ Balanced signal exchange
                    </span>
                  )
                ) : (
                  <span style={{color: '#6b7280'}}>
                    Directional data not available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Insights */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
          <TrendingUp style={styles.sectionIcon} />
          Key Insights
        </h3>
        
        <div style={styles.insightsList}>
          {generateInsights(data).map((insight, idx) => (
            <div key={idx} style={styles.insightItem}>
              <div style={{
                ...styles.insightIcon,
                backgroundColor: insight.type === 'warning' ? '#fef3c7' : 
                               insight.type === 'success' ? '#d1fae5' : '#dbeafe',
                color: insight.type === 'warning' ? '#d97706' : 
                       insight.type === 'success' ? '#059669' : '#1e40af'
              }}>
                {insight.type === 'warning' ? '⚠️' : 
                 insight.type === 'success' ? '✓' : 'ℹ️'}
              </div>
              <div style={styles.insightContent}>
                <div style={styles.insightTitle}>{insight.title}</div>
                <div style={styles.insightDescription}>{insight.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate insights
function generateInsights(data) {
  const insights = [];

  // Guard — no competitors means no insights to generate
  if (!data.competitors || data.competitors.length === 0) {
    insights.push({
      type: 'info',
      title: 'No Cross-Visitors Found',
      description: 'No devices were detected visiting both the primary and secondary locations in the selected date range. Try expanding the date range or increasing the search radius.'
    });
    return insights;
  }

  // Find highest overlap
  const highestOverlap = data.competitors.reduce((max, comp) => 
    comp.overlapPercent > max.overlapPercent ? comp : max
  );
  
  if (highestOverlap.overlapPercent > 20) {
    insights.push({
      type: 'warning',
      title: 'High Signal Overlap Detected',
      description: `${highestOverlap.name} shares ${highestOverlap.overlapPercent}% of behavioral signals with your primary location. Consider differentiation strategies.`
    });
  }
  
  // Check for signals leaving
  const leavingCompetitors = data.competitors.filter(comp => 
    comp.primaryToCompetitor?.hnmi?.expected > comp.competitorToPrimary?.hnmi?.expected
  );
  
  if (leavingCompetitors.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Signal Leakage Observed',
      description: `${leavingCompetitors.length} competitor(s) are capturing more signals from your location than you're capturing from them.`
    });
  }
  
  // Check for signals coming in
  const gainingCompetitors = data.competitors.filter(comp => 
    comp.competitorToPrimary?.hnmi?.expected > comp.primaryToCompetitor?.hnmi?.expected
  );
  
  if (gainingCompetitors.length > 0) {
    insights.push({
      type: 'success',
      title: 'Positive Signal Flow',
      description: `You're successfully attracting signals from ${gainingCompetitors.length} competitor location(s).`
    });
  }
  
  // Total reach with HNMI
  const expectedSignals = data.primary.signals?.hnmi?.expected || 0;
  const signalRange = `${data.primary.signals?.hnmi?.conservative.toLocaleString()} - ${data.primary.signals?.hnmi?.upper_bound.toLocaleString()}`;
  
  insights.push({
    type: 'info',
    title: 'Total Location Signal Strength',
    description: `Your primary location generated approximately ${expectedSignals.toLocaleString()} behavioral signals (range: ${signalRange}) during the analysis period.`
  });
  
  return insights;
}

const styles = {
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  resultsHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  resultsIcon: {
    width: '24px',
    height: '24px',
    color: '#4f46e5',
  },
  resultsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    background: 'white',
    color: '#374151',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  exportIcon: {
    width: '18px',
    height: '18px',
  },
  summaryBox: {
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid #e5e7eb',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '0.75rem',
  },
  summaryLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  summaryValue: {
    color: '#1f2937',
    fontWeight: '600',
  },
  disclaimerBox: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  disclaimerIcon: {
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  disclaimerText: {
    fontSize: '0.875rem',
    color: '#1e40af',
    lineHeight: '1.5',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  kpiIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    borderRadius: '8px',
  },
  kpiContent: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.25rem',
  },
  kpiValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  kpiRange: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  chartContainer: {
    marginTop: '2rem',
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  simpleChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '200px',
    gap: '0.5rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '8px',
  },
  chartBar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  barFill: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    marginTop: 'auto',
  },
  barLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  sectionIcon: {
    width: '20px',
    height: '20px',
    color: '#4f46e5',
  },
  helperText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  tableHeaderCell: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#374151',
  },
  locationCell: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  locationName: {
    fontWeight: '600',
    color: '#1f2937',
  },
  locationAddress: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  percentBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  movementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  movementCard: {
    padding: '1.25rem',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  movementHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  movementTitle: {
    fontWeight: '600',
    color: '#1f2937',
  },
  movementStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem',
  },
  movementStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  movementArrow: {
    fontSize: '1.5rem',
    color: '#4f46e5',
    fontWeight: 'bold',
  },
  movementLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  movementValue: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  movementNote: {
    fontSize: '0.75rem',
    padding: '0.5rem',
    background: 'white',
    borderRadius: '4px',
    textAlign: 'center',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  insightItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  insightIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.25rem',
  },
  insightDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
};