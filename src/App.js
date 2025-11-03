import React, { useState } from 'react';
import LeakageForm from './leakageform';
import LeakageResults from './leakageresult';

export default function GeoTestAnalyzer() {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (inputData) => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        primaryAddress: inputData.primaryAddress,
        totalPatients: inputData.totalPatients,
        patientsRetained: inputData.patientsRetained,
        timePeriod: inputData.timePeriod,
        competitors: inputData.competitors
      };

      const response = await fetch('http://localhost:3001/api/calculate-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setFormData(inputData);
      } else {
        setError(result.error || 'Failed to calculate events');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!data || !formData) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Primary Address,Destination,Total Patients Served,Patients Retained,Events to Competitor,Leakage %\n';

    data.results.forEach(row => {
      csvContent += `"${row.primaryAddress}","${row.destination}",${row.totalPatients},${row.retained},${row.eventsToCompetitor},${row.leakagePercent}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'patient-flow-analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src="/logonew.png" alt="Logo" style={styles.logo}/>
      </div>
      <div style={styles.maxWidth}>
        <LeakageForm 
          onCalculate={handleCalculate} 
          loading={loading} 
          error={error}
        />

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Analyzing patient leakage...</p>
          </div>
        )}

        {data && formData && (
          <LeakageResults 
            data={data} 
            formData={formData}
            onExport={handleExport}
          />
        )}
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%)',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    maxWidth: '250px',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '2rem',
  },
  spinner: {
    display: 'inline-block',
    width: '32px',
    height: '32px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '0.5rem',
    color: '#4b5563',
    fontWeight: '500',
  },
};