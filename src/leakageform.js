import React, { useState } from 'react';
import { MapPin, Users, Calendar, TrendingUp, Plus, X, AlertCircle } from 'lucide-react';

export default function LeakageForm({ onCalculate, loading, error }) {
  const [primaryAddress, setPrimaryAddress] = useState('');
  const [totalPatients, setTotalPatients] = useState('');
  const [patientsRetained, setPatientsRetained] = useState('');
  const [timePeriod, setTimePeriod] = useState('12');
  const [competitors, setCompetitors] = useState([{ address: '', signalStrength: '' }]);

  const handleAddCompetitor = () => {
    if (competitors.length < 25) {
      setCompetitors([...competitors, { address: '', signalStrength: '' }]);
    }
  };

  const handleRemoveCompetitor = (index) => {
    const newCompetitors = competitors.filter((_, i) => i !== index);
    setCompetitors(newCompetitors);
  };

  const handleCompetitorChange = (index, field, value) => {
    const newCompetitors = [...competitors];
    newCompetitors[index][field] = value;
    setCompetitors(newCompetitors);
  };

  const validateInputs = () => {
    if (!primaryAddress.trim()) return false;
    const total = parseInt(totalPatients);
    if (!totalPatients || total <= 0) return false;
    const retained = parseInt(patientsRetained);
    if (patientsRetained === '' || retained < 0 || retained > total) return false;
    const validCompetitors = competitors.filter(c => c.address.trim() !== '');
    return validCompetitors.length > 0;
  };

  const handleSubmit = () => {
    const validCompetitors = competitors
      .filter(c => c.address.trim() !== '')
      .map(c => ({
        address: c.address.trim(),
        signalStrength: c.signalStrength ? parseFloat(c.signalStrength) : null
      }));

    onCalculate({
      primaryAddress: primaryAddress.trim(),
      totalPatients: parseInt(totalPatients),
      patientsRetained: parseInt(patientsRetained),
      timePeriod: parseInt(timePeriod),
      competitors: validCompetitors
    });
  };

  const calculateLeakage = () => {
    const total = parseInt(totalPatients);
    const retained = parseInt(patientsRetained);
    const leaked = total - retained;
    if (total <= 0) return 0;
    return ((leaked / total) * 100).toFixed(1);
  };

  const leakagePercent = totalPatients && patientsRetained !== ''
    ? calculateLeakage()
    : '—';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <MapPin style={styles.headerIcon} />
        <h1 style={styles.title}>Patient Leakage Analyzer</h1>
      </div>

      <div style={styles.formContainer}>
        {/* Primary Address */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <MapPin style={styles.labelIcon} />
            Primary Address *
          </label>
          <input
            type="text"
            value={primaryAddress}
            onChange={(e) => setPrimaryAddress(e.target.value)}
            placeholder="e.g., Main Clinic, 1450 Medical Way, Greenwood, IN"
            style={styles.input}
          />
        </div>

        {/* Total Patients & Retained */}
        <div style={styles.twoColumn}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Users style={styles.labelIcon} />
              Total Patients Served *
            </label>
            <input
              type="number"
              value={totalPatients}
              onChange={(e) => setTotalPatients(e.target.value)}
              placeholder="e.g., 2615"
              style={styles.input}
              min="1"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Users style={styles.labelIcon} />
              Patients Retained at Primary *
            </label>
            <input
              type="number"
              value={patientsRetained}
              onChange={(e) => setPatientsRetained(e.target.value)}
              placeholder="e.g., 362"
              style={styles.input}
              min="0"
              max={totalPatients || undefined}
            />
          </div>
        </div>

        {/* Active Leakage Display */}
        {totalPatients && patientsRetained !== '' && (
          <div style={styles.leakageBox}>
            <TrendingUp style={styles.trendIcon} />
            <div style={styles.leakageContent}>
              <span style={styles.leakageLabel}>Patient Leakage Rate</span>
              <span style={styles.leakageValue}>{leakagePercent}%</span>
            </div>
            <span style={styles.leakedCount}>
              ({parseInt(totalPatients) - parseInt(patientsRetained)} of {parseInt(totalPatients)} patients)
            </span>
          </div>
        )}

        {/* Time Period */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <Calendar style={styles.labelIcon} />
            Time Period (Months) *
          </label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={styles.select}
          >
            {[1, 3, 6, 12, 18, 24].map(m => (
              <option key={m} value={m}>
                {m} month{m !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Competitor Addresses */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <TrendingUp style={styles.labelIcon} />
            Competitor Addresses ({competitors.filter(c => c.address.trim()).length}/{competitors.length}) *
          </label>
          <p style={styles.helperText}>
            Signal Strength (optional): Enter 0-1 or weight value to influence patient distribution
          </p>
          {competitors.map((competitor, index) => (
            <div key={index} style={styles.competitorRow}>
              <div style={styles.competitorInputs}>
                <input
                  type="text"
                  value={competitor.address}
                  onChange={(e) => handleCompetitorChange(index, 'address', e.target.value)}
                  placeholder={`Competitor ${index + 1} address`}
                  style={{ ...styles.input, flex: 1 }}
                />
                <input
                  type="number"
                  value={competitor.signalStrength}
                  onChange={(e) => handleCompetitorChange(index, 'signalStrength', e.target.value)}
                  placeholder="Signal"
                  style={{ ...styles.input, width: '100px' }}
                  min="0"
                  step="0.01"
                />
              </div>
              {competitors.length > 1 && (
                <button
                  onClick={() => handleRemoveCompetitor(index)}
                  style={styles.removeButton}
                  title="Remove competitor"
                >
                  <X style={styles.removeIcon} />
                </button>
              )}
            </div>
          ))}
          {competitors.length < 25 && (
            <button onClick={handleAddCompetitor} style={styles.addButton}>
              <Plus style={styles.addIcon} />
              Add Competitor ({25 - competitors.length} remaining)
            </button>
          )}
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle style={styles.errorIcon} />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          style={{...styles.calculateButton, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
          disabled={loading || !validateInputs()}
        >
          {loading ? 'Calculating...' : 'Calculate Leakage Distribution'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    marginBottom: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  headerIcon: {
    width: '32px',
    height: '32px',
    color: '#4f46e5',
    flexShrink: 0,
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  labelIcon: {
    width: '16px',
    height: '16px',
    color: '#4f46e5',
    flexShrink: 0,
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  helperText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
    fontStyle: 'italic',
  },
  leakageBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: '#fef3c7',
    padding: '1.25rem',
    borderRadius: '8px',
    borderLeft: '4px solid #f59e0b',
  },
  trendIcon: {
    width: '24px',
    height: '24px',
    color: '#d97706',
    flexShrink: 0,
  },
  leakageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  leakageLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#92400e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  leakageValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#d97706',
  },
  leakedCount: {
    fontSize: '0.875rem',
    color: '#92400e',
    marginLeft: 'auto',
  },
  competitorRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  competitorInputs: {
    display: 'flex',
    gap: '0.5rem',
    flex: 1,
  },
  removeButton: {
    padding: '0.5rem',
    border: 'none',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  removeIcon: {
    width: '20px',
    height: '20px',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    border: '1px dashed #4f46e5',
    background: 'transparent',
    color: '#4f46e5',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    marginTop: '0.5rem',
  },
  addIcon: {
    width: '18px',
    height: '18px',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#991b1b',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  errorIcon: {
    width: '18px',
    height: '18px',
    flexShrink: 0,
  },
  calculateButton: {
    padding: '1rem',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem',
  },
};