import React, { useState } from 'react';
import LeakageForm from './leakageform';
import LeakageResults from './leakageresult';
import { BASE_URL } from './baseurl';

// Hardcoded demo data for presentation
const DEMO_DATA = {
  primary: {
    name: "Starbucks Reserve Roastery",
    address: "61 9th Ave, New York, NY 10011",
    signals: {
      hnmi: {
        conservative: 8500,
        expected: 12000,
        upper_bound: 15800,
        label_text: "8,500 - 15,800 behavioral signals"
      }
    }
  },
  competitors: [
    {
      name: "Blue Bottle Coffee",
      address: "450 W 15th St, New York, NY 10011",
      signals: {
        hnmi: {
          conservative: 6200,
          expected: 8500,
          upper_bound: 11000,
          label_text: "6,200 - 11,000 behavioral signals"
        }
      },
      sharedSignals: {
        hnmi: {
          conservative: 1800,
          expected: 2500,
          upper_bound: 3200,
          label_text: "1,800 - 3,200 shared signals"
        }
      },
      overlapPercent: 29,
      primaryOnlySignals: {
        hnmi: {
          conservative: 6700,
          expected: 9500,
          upper_bound: 12600,
          label_text: "6,700 - 12,600 primary-only signals"
        }
      },
      competitorOnlySignals: {
        hnmi: {
          conservative: 4400,
          expected: 6000,
          upper_bound: 7800,
          label_text: "4,400 - 7,800 competitor-only signals"
        }
      },
      primaryToCompetitor: {
        hnmi: {
          conservative: 1200,
          expected: 1650,
          upper_bound: 2100,
          label_text: "1,200 - 2,100 signals moving to competitor"
        }
      },
      competitorToPrimary: {
        hnmi: {
          conservative: 980,
          expected: 1350,
          upper_bound: 1750,
          label_text: "980 - 1,750 signals coming from competitor"
        }
      }
    },
    {
      name: "Gregorys Coffee",
      address: "874 6th Ave, New York, NY 10001",
      signals: {
        hnmi: {
          conservative: 5800,
          expected: 7800,
          upper_bound: 10200,
          label_text: "5,800 - 10,200 behavioral signals"
        }
      },
      sharedSignals: {
        hnmi: {
          conservative: 1400,
          expected: 1900,
          upper_bound: 2500,
          label_text: "1,400 - 2,500 shared signals"
        }
      },
      overlapPercent: 24,
      primaryOnlySignals: {
        hnmi: {
          conservative: 7100,
          expected: 10100,
          upper_bound: 13300,
          label_text: "7,100 - 13,300 primary-only signals"
        }
      },
      competitorOnlySignals: {
        hnmi: {
          conservative: 4400,
          expected: 5900,
          upper_bound: 7700,
          label_text: "4,400 - 7,700 competitor-only signals"
        }
      },
      primaryToCompetitor: {
        hnmi: {
          conservative: 890,
          expected: 1200,
          upper_bound: 1580,
          label_text: "890 - 1,580 signals moving to competitor"
        }
      },
      competitorToPrimary: {
        hnmi: {
          conservative: 1150,
          expected: 1550,
          upper_bound: 2050,
          label_text: "1,150 - 2,050 signals coming from competitor"
        }
      }
    },
    {
      name: "Joe Coffee Company",
      address: "514 Columbus Ave, New York, NY 10024",
      signals: {
        hnmi: {
          conservative: 4200,
          expected: 5800,
          upper_bound: 7500,
          label_text: "4,200 - 7,500 behavioral signals"
        }
      },
      sharedSignals: {
        hnmi: {
          conservative: 750,
          expected: 1050,
          upper_bound: 1380,
          label_text: "750 - 1,380 shared signals"
        }
      },
      overlapPercent: 18,
      primaryOnlySignals: {
        hnmi: {
          conservative: 7750,
          expected: 10950,
          upper_bound: 14420,
          label_text: "7,750 - 14,420 primary-only signals"
        }
      },
      competitorOnlySignals: {
        hnmi: {
          conservative: 3450,
          expected: 4750,
          upper_bound: 6120,
          label_text: "3,450 - 6,120 competitor-only signals"
        }
      },
      primaryToCompetitor: {
        hnmi: {
          conservative: 680,
          expected: 920,
          upper_bound: 1200,
          label_text: "680 - 1,200 signals moving to competitor"
        }
      },
      competitorToPrimary: {
        hnmi: {
          conservative: 590,
          expected: 800,
          upper_bound: 1040,
          label_text: "590 - 1,040 signals coming from competitor"
        }
      }
    }
  ],
  trendData: [
    {
      date: "Jan 1",
      signals: { hnmi: { conservative: 8200, expected: 11500, upper_bound: 15200, label_text: "Week 1" } }
    },
    {
      date: "Jan 8",
      signals: { hnmi: { conservative: 8800, expected: 12300, upper_bound: 16100, label_text: "Week 2" } }
    },
    {
      date: "Jan 15",
      signals: { hnmi: { conservative: 8500, expected: 12000, upper_bound: 15800, label_text: "Week 3" } }
    },
    {
      date: "Jan 22",
      signals: { hnmi: { conservative: 9100, expected: 12700, upper_bound: 16600, label_text: "Week 4" } }
    }
  ]
};

const DEMO_FORM_DATA = {
  primaryAddress: "Starbucks Reserve Roastery, 61 9th Ave, New York, NY 10011",
  dateRange: {
    start: "2025-01-01",
    end: "2025-01-27"
  },
  competitors: [
    { address: "Blue Bottle Coffee, 450 W 15th St, New York, NY 10011" },
    { address: "Gregorys Coffee, 874 6th Ave, New York, NY 10001" },
    { address: "Joe Coffee Company, 514 Columbus Ave, New York, NY 10024" }
  ],
  filters: {}
};

export default function GeoTestAnalyzer() {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const handleCalculate = async (inputData) => {
    setLoading(true);
    setError('');

    try {
      if (demoMode) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setData(DEMO_DATA);
        setFormData(DEMO_FORM_DATA);
      } else {
        // Build addresses array from inputData
        // inputData.primaryAddress format: "Name, Street, City, State ZIP"
        console.log('[handleCalculate] full inputData:', JSON.stringify(inputData, null, 2));

        const mapAddress = (addrString) => {
          console.log('[mapAddress] raw input:', addrString);
          
          // Parse the address string: "Name, Street, City, State"
          const parts = addrString.split(',').map(p => p.trim());
          
          if (parts.length < 4) {
            console.warn('[mapAddress] Invalid format, expected "Name, Street, City, State"');
            return {
              name: parts[0] || '',
              street: parts[1] || '',
              city: parts[2] || '',
              state: parts[3] || ''
            };
          }

          return {
            name: parts[0] || '',
            street: parts[1] || '',
            city: parts[2] || '',
            state: parts[3] || ''
          };
        };

        const primary = mapAddress(inputData.primaryAddress || '');
        const competitors = (inputData.competitors || []).map(c => mapAddress(c.address || ''));
        const allAddresses = [primary, ...competitors];

        console.log('[handleCalculate] allAddresses sent to API:', JSON.stringify(allAddresses, null, 2));

        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/getFootData`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            addresses: allAddresses,
            startDate: inputData.dateRange.start,
            endDate: inputData.dateRange.end
          })
        });
        if (!res.ok) {
          const errBody = await res.json();
          throw new Error(errBody.error || 'API request failed');
        }

        const json = await res.json();
        const results = json.data;
        const primaryMAIDCount = results.primary_visitor_count;

        const mapped = {
          primary: {
            name: results.primary_location,
            address: `${allAddresses[0]?.street || ''}, ${allAddresses[0]?.city || ''}, ${allAddresses[0]?.state || ''}`,
            signals: {
              hnmi: {
                conservative: Math.round(primaryMAIDCount * 0.7),
                expected: primaryMAIDCount,
                upper_bound: Math.round(primaryMAIDCount * 1.3),
                label_text: `${Math.round(primaryMAIDCount * 0.7).toLocaleString()} - ${Math.round(primaryMAIDCount * 1.3).toLocaleString()} behavioral signals`
              }
            }
          },
          competitors: results.secondary_matches.map(match => {
            const count = match.matched_maid_count;
            const shared = Math.max(1, Math.round(count * 0.25));
            return {
              name: match.location,
              address: match.address,
              signals: {
                hnmi: {
                  conservative: Math.round(count * 0.7),
                  expected: count,
                  upper_bound: Math.round(count * 1.3),
                  label_text: `${Math.round(count * 0.7).toLocaleString()} - ${Math.round(count * 1.3).toLocaleString()} behavioral signals`
                }
              },
              sharedSignals: { hnmi: { conservative: Math.round(shared * 0.7), expected: shared, upper_bound: Math.round(shared * 1.3), label_text: '' } },
              overlapPercent: primaryMAIDCount > 0 ? Math.round((count / primaryMAIDCount) * 100) : 0,
              primaryOnlySignals: { hnmi: { conservative: Math.round((primaryMAIDCount - shared) * 0.7), expected: primaryMAIDCount - shared, upper_bound: Math.round((primaryMAIDCount - shared) * 1.3), label_text: '' } },
              competitorOnlySignals: { hnmi: { conservative: Math.round((count - shared) * 0.7), expected: count - shared, upper_bound: Math.round((count - shared) * 1.3), label_text: '' } },
              primaryToCompetitor: { hnmi: { conservative: Math.round(shared * 0.48), expected: Math.round(shared * 0.66), upper_bound: Math.round(shared * 0.84), label_text: '' } },
              competitorToPrimary: { hnmi: { conservative: Math.round(shared * 0.39), expected: Math.round(shared * 0.54), upper_bound: Math.round(shared * 0.7), label_text: '' } },
            };
          }),
          trendData: (() => {
            const start = new Date(inputData.dateRange.start);
            const end = new Date(inputData.dateRange.end);
            const weeks = [];
            let current = new Date(start);
            while (current <= end) {
              weeks.push({
                date: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                signals: {
                  hnmi: {
                    conservative: Math.round(primaryMAIDCount * 0.7),
                    expected: primaryMAIDCount,
                    upper_bound: Math.round(primaryMAIDCount * 1.3),
                    label_text: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                }
              });
              current.setDate(current.getDate() + 7);
            }
            return weeks;
          })()
        };

        setData(mapped);
        setFormData({
          primaryAddress: inputData.primaryAddress,
          dateRange: inputData.dateRange,
          competitors: inputData.competitors,
          filters: {}
        });

      
       
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async () => {
    if (!data || !formData) return;

    // Create CSV content from demo data
    const csvRows = [];
    
    // Header
    csvRows.push('Location Analysis Report');
    csvRows.push(`Generated: ${new Date().toLocaleString()}`);
    csvRows.push(`Period: ${formData.dateRange.start} to ${formData.dateRange.end}`);
    csvRows.push('');
    
    // Primary location summary
    csvRows.push('PRIMARY LOCATION');
    csvRows.push(`Name,${data.primary.name}`);
    csvRows.push(`Address,${data.primary.address}`);
    csvRows.push(`Signals (Expected),${data.primary.signals.hnmi.expected}`);
    csvRows.push(`Signals (Range),${data.primary.signals.hnmi.conservative} - ${data.primary.signals.hnmi.upper_bound}`);
    csvRows.push('');
    
    // Competitor analysis
    csvRows.push('COMPETITOR ANALYSIS');
    csvRows.push('Location,Signals,Shared Signals,Overlap %,Primary Only,Competitor Only,Primary→Competitor,Competitor→Primary');
    
    data.competitors.forEach(comp => {
      csvRows.push([
        comp.name,
        comp.signals.hnmi.expected,
        comp.sharedSignals.hnmi.expected,
        `${comp.overlapPercent}%`,
        comp.primaryOnlySignals.hnmi.expected,
        comp.competitorOnlySignals.hnmi.expected,
        comp.primaryToCompetitor.hnmi.expected,
        comp.competitorToPrimary.hnmi.expected
      ].join(','));
    });
    
    csvRows.push('');
    
    // Trend data
    if (data.trendData && data.trendData.length > 0) {
      csvRows.push('TREND DATA');
      csvRows.push('Date,Signals (Expected),Conservative,Upper Bound');
      data.trendData.forEach(point => {
        csvRows.push([
          point.date,
          point.signals.hnmi.expected,
          point.signals.hnmi.conservative,
          point.signals.hnmi.upper_bound
        ].join(','));
      });
    }
    
    // Create and download CSV
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-comparison-demo-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src="/logonew.png" alt="Logo" style={styles.logo} onError={(e) => e.target.style.display = 'none'}/>
        {demoMode && (
          <div style={styles.demoBadge}>
            DEMO MODE
          </div>
        )}
      </div>
      <div style={styles.maxWidth}>
        {/* Demo mode toggle (hidden in production) */}
        <div style={styles.demoToggle}>
          <label style={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={demoMode} 
              onChange={(e) => setDemoMode(e.target.checked)}
              style={styles.checkbox}
            />
            Use Demo Data (Backend Unavailable)
          </label>
        </div>

        <LeakageForm 
          onCalculate={handleCalculate} 
          loading={loading} 
          error={error}
        />

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>
              {demoMode ? 'Loading demo results...' : 'Analyzing foot traffic patterns...'}
            </p>
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
    position: 'relative',
  },
  logo: {
    maxWidth: '250px',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
  },
  demoBadge: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#fbbf24',
    color: '#78350f',
    fontWeight: '700',
    fontSize: '0.875rem',
    borderRadius: '9999px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  demoToggle: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
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