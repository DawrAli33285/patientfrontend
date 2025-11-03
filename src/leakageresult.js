import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function LeakageResults({ data, formData, onExport }) {
  if (!data) return null;

  const leakagePercent = formData.totalPatients && formData.patientsRetained !== ''
    ? (((formData.totalPatients - formData.patientsRetained) / formData.totalPatients) * 100).toFixed(1)
    : '—';

  return (
    <div style={styles.resultsContainer}>
      <div style={styles.card}>
        <div style={styles.resultsHeader}>
          <div style={styles.resultsHeaderLeft}>
            <FileText style={styles.resultsIcon} />
            <h2 style={styles.resultsTitle}>Leakage Analysis Results</h2>
          </div>
          <button onClick={onExport} style={styles.exportButton}>
            <Download style={styles.exportIcon} />
            Export CSV
          </button>
        </div>

        <div style={styles.summaryBox}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Primary Address:</span>
            <span style={styles.summaryValue}>{data.primaryAddress}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Total Patients Served:</span>
            <span style={styles.summaryValue}>{formData.totalPatients.toLocaleString()}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Patients Retained:</span>
            <span style={styles.summaryValue}>{formData.patientsRetained.toLocaleString()}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Patient Leakage Rate:</span>
            <span style={{...styles.summaryValue, color: '#dc2626', fontSize: '1.25rem', fontWeight: '700'}}>{leakagePercent}%</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Leaked Patients:</span>
            <span style={styles.summaryValue}>{(formData.totalPatients - formData.patientsRetained).toLocaleString()}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Analysis Period:</span>
            <span style={styles.summaryValue}>{formData.timePeriod} month{formData.timePeriod !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.tableTitle}>Patient Distribution to Competitors</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Competitor / Destination</th>
                <th style={styles.tableHeaderCell}>Leaked Patients</th>
                <th style={styles.tableHeaderCell}>% of Total</th>
                <th style={styles.tableHeaderCell}>% of Leakage</th>
              </tr>
            </thead>
            <tbody>
              {data.results && data.results.map((row, idx) => {
                const leakedPatients = formData.totalPatients - formData.patientsRetained;
                const pctOfLeakage = leakedPatients > 0 ? ((row.eventsToCompetitor / leakedPatients) * 100).toFixed(1) : 0;
                return (
                  <tr key={idx} style={{...styles.tableRow, backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb'}}>
                    <td style={styles.tableCell}>{row.destination}</td>
                    <td style={{...styles.tableCell, textAlign: 'center', fontWeight: '600'}}>{row.eventsToCompetitor}</td>
                    <td style={{...styles.tableCell, textAlign: 'center'}}>
                      <span style={styles.percentBadge}>{row.leakagePercent}%</span>
                    </td>
                    <td style={{...styles.tableCell, textAlign: 'center'}}>
                      <span style={{...styles.leakageBadge, backgroundColor: pctOfLeakage > 30 ? '#fee2e2' : '#dbeafe', color: pctOfLeakage > 30 ? '#991b1b' : '#1e40af'}}>
                        {pctOfLeakage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
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
    marginBottom: '0rem',
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
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem',
    border: '1px solid #e5e7eb',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
  },
  summaryLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  summaryValue: {
    color: '#1f2937',
    fontWeight: '600',
  },
  tableTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
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
  percentBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  leakageBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'inline-block',
  },
};