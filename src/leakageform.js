import React, { useState } from 'react';
import { MapPin, Calendar, TrendingUp, Plus, AlertCircle } from 'lucide-react';

export default function LeakageForm({ onCalculate, loading, error }) {
  const [primaryAddress, setPrimaryAddress] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [competitors, setCompetitors] = useState([{ address: '' }]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    dayOfWeek: '',
    timeOfDay: ''
  });

  const handleAddCompetitor = () => {
    if (competitors.length < 10) {
      setCompetitors([...competitors, { address: '' }]);
    }
  };

 
  const handleCompetitorChange = (index, value) => {
    const newCompetitors = [...competitors];
    newCompetitors[index].address = value;
    setCompetitors(newCompetitors);
  };  

  const handlePrimaryAddressChange = (value) => {
    // Handle both string and object values from LocationSuggestionField
    if (typeof value === 'object' && value.name) {
      setPrimaryAddress(value.name);
    } else {
      setPrimaryAddress(value);
    }
  };

  const validateInputs = () => {
    if (!primaryAddress.trim()) return false;
    if (!dateRange.start || !dateRange.end) return false;
    const validCompetitors = competitors.filter(c => c.address && c.address.trim() !== '');
    return validCompetitors.length > 0;
  };

  const handleSubmit = () => {
    const validCompetitors = competitors
      .filter(c => c.address && c.address.trim() !== '')
      .map(c => ({ 
        address: c.address.trim(),
        latitude: c.latitude,
        longitude: c.longitude
      }));
  
    onCalculate({
      primaryAddress: primaryAddress.trim(),
      dateRange,
      competitors: validCompetitors,
      filters: showAdvanced ? filters : {}
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <MapPin style={styles.headerIcon} />
        <h1 style={styles.title}>Location Traffic Comparison</h1>
      </div>

      <div style={styles.formContainer}>
        {/* Primary Address */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <MapPin style={styles.labelIcon} />
            Primary Location Address *
          </label>
          <input
            type="text"
            value={primaryAddress}
            onChange={(e) => setPrimaryAddress(e.target.value)}
            placeholder="e.g., Starbucks, 123 Main St, New York, NY"
            style={styles.input}
            required
          />
          <small style={styles.helpText}>
            Format: Name, Street, City, State (e.g., "Starbucks, 123 Main St, New York, NY")
          </small>
        </div>

        {/* Date Range */}
        <div style={styles.twoColumn}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Calendar style={styles.labelIcon} />
              Start Date *
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Calendar style={styles.labelIcon} />
              End Date *
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              style={styles.input}
            />
          </div>
        </div>

        {/* Competitor Addresses */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <TrendingUp style={styles.labelIcon} />
            Competitor Locations ({competitors.filter(c => c.address && c.address.trim()).length}) *
          </label>
          {competitors.map((competitor, index) => (
  <div key={index} style={styles.competitorRow}>
    <input
      type="text"
      value={competitor.address}
      onChange={(e) => handleCompetitorChange(index, e.target.value)}
      placeholder="e.g., Blue Bottle Coffee, 456 Oak Ave, Brooklyn, NY"
      style={{ ...styles.input, flex: 1 }}
    />
  </div>
))}

          {competitors.length < 10 && (
            <button onClick={handleAddCompetitor} style={styles.addButton}>
              <Plus style={styles.addIcon} />
              Add Competitor Location
            </button>
          )}
        </div>

        {/* Advanced Filters (Optional) */}
        <div style={styles.formGroup}>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={styles.advancedToggle}
          >
            {showAdvanced ? '− Hide' : '+ Show'} Advanced Filters (Optional)
          </button>
          
          {showAdvanced && (
            <div style={styles.advancedFilters}>
              <div style={styles.twoColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Day of Week</label>
                  <select
                    value={filters.dayOfWeek}
                    onChange={(e) => setFilters({...filters, dayOfWeek: e.target.value})}
                    style={styles.select}
                  >
                    <option value="">All Days</option>
                    <option value="weekday">Weekdays Only</option>
                    <option value="weekend">Weekends Only</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Time of Day</label>
                  <select
                    value={filters.timeOfDay}
                    onChange={(e) => setFilters({...filters, timeOfDay: e.target.value})}
                    style={styles.select}
                  >
                    <option value="">All Hours</option>
                    <option value="morning">Morning (6am-12pm)</option>
                    <option value="afternoon">Afternoon (12pm-6pm)</option>
                    <option value="evening">Evening (6pm-12am)</option>
                    <option value="night">Night (12am-6am)</option>
                  </select>
                </div>
              </div>
            </div>
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
          style={{
            ...styles.calculateButton, 
            opacity: loading || !validateInputs() ? 0.5 : 1, 
            cursor: loading || !validateInputs() ? 'not-allowed' : 'pointer'
          }}
          disabled={loading || !validateInputs()}
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
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
  inputWrapper: {
    position: 'relative',
    width: '100%',
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
  competitorRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
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
    flexShrink: 0,
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
  advancedToggle: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    color: '#374151',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    textAlign: 'left',
  },
  advancedFilters: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '6px',
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