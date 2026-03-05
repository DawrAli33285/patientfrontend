import { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from './baseurl';

function SuperAdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setIsLoading(true);
      let response = await axios.post(`${BASE_URL}/adminRegister`, formData);
      localStorage.setItem('adminToken', response.data.token);
      setIsLoading(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      toast.success('Registeration was sucessfull', { containerId: 'adminRegister' });
      navigate('/admin/dashboard');
    } catch (e) {
      setIsLoading(false);
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: 'adminRegister' });
      } else {
        toast.error('Error occured while trying to register', { containerId: 'adminRegister' });
      }
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 50%, #111827 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      fontFamily: 'sans-serif',
    },
    bgBlob1: {
      position: 'absolute',
      top: '-160px',
      right: '-160px',
      width: '320px',
      height: '320px',
      background: '#3b82f6',
      borderRadius: '50%',
      filter: 'blur(60px)',
      opacity: 0.2,
      pointerEvents: 'none',
    },
    bgBlob2: {
      position: 'absolute',
      bottom: '-160px',
      left: '-160px',
      width: '320px',
      height: '320px',
      background: '#a855f7',
      borderRadius: '50%',
      filter: 'blur(60px)',
      opacity: 0.2,
      pointerEvents: 'none',
    },
    bgBlob3: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '320px',
      height: '320px',
      background: '#ec4899',
      borderRadius: '50%',
      filter: 'blur(60px)',
      opacity: 0.2,
      pointerEvents: 'none',
    },
    cardWrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '448px',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
      overflow: 'hidden',
    },
    cardHeader: {
      background: 'linear-gradient(90deg, #16a34a, #166534)',
      padding: '40px 32px',
      textAlign: 'center',
    },
    logoWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '24px',
    },
    logo: {
      width: '96px',
      height: '96px',
      borderRadius: '50%',
      objectFit: 'cover',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      border: '4px solid #ffffff',
      backgroundColor: '#ffffff',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff',
      margin: '0 0 8px 0',
    },
    cardSubtitle: {
      color: '#bbf7d0',
      fontSize: '14px',
      margin: 0,
    },
    cardBody: {
      padding: '40px 32px',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#4b5563',
      fontSize: '14px',
      padding: 0,
      marginBottom: '24px',
      textDecoration: 'none',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      top: '50%',
      left: '12px',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: '#9ca3af',
      display: 'flex',
      alignItems: 'center',
    },
    input: (hasError) => ({
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      paddingLeft: '40px',
      paddingRight: '12px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '14px',
      color: '#111827',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }),
    inputWithEye: (hasError) => ({
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      paddingLeft: '40px',
      paddingRight: '40px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '14px',
      color: '#111827',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }),
    eyeButton: {
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      color: '#9ca3af',
    },
    errorText: {
      marginTop: '6px',
      fontSize: '13px',
      color: '#dc2626',
    },
    submitButton: (isLoading) => ({
      width: '100%',
      background: 'linear-gradient(90deg, #16a34a, #166534)',
      color: '#ffffff',
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '4px',
      transition: 'opacity 0.2s, transform 0.2s',
    }),
    divider: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
      textAlign: 'center',
    },
    secureNote: {
      fontSize: '12px',
      color: '#9ca3af',
    },
    footer: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '14px',
      marginTop: '24px',
      opacity: 0.75,
    },
  };

  return (
    <>
      <ToastContainer containerId="adminRegister" />

      <div style={styles.page}>
        {/* Background blobs */}
        <div style={styles.bgBlob1} />
        <div style={styles.bgBlob2} />
        <div style={styles.bgBlob3} />

        <div style={styles.cardWrapper}>
          <div style={styles.card}>
            {/* Header */}
            <div style={styles.cardHeader}>
              <div style={styles.logoWrapper}>
                <img src="./logo.jpg" alt="Company Logo" style={styles.logo} />
              </div>
              <h1 style={styles.cardTitle}>Create Admin Account</h1>
              <p style={styles.cardSubtitle}>Register to access the admin panel</p>
            </div>

            {/* Body */}
            <div style={styles.cardBody}>
              <Link to="/adminlogin" style={styles.backButton}>
                <ArrowLeft size={16} />
                Back to Login
              </Link>

              {/* Full Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><User size={20} /></span>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={styles.input(!!errors.name)}
                  />
                </div>
                {errors.name && <p style={styles.errorText}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Mail size={20} /></span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    style={styles.input(!!errors.email)}
                  />
                </div>
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Lock size={20} /></span>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    style={styles.inputWithEye(!!errors.password)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p style={styles.errorText}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Lock size={20} /></span>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    style={styles.inputWithEye(!!errors.confirmPassword)}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={isLoading} style={styles.submitButton(isLoading)}>
                {isLoading ? (
                  <>
                    <svg
                      style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                      <path fill="currentColor" style={{ opacity: 0.75 }} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Footer note */}
              <div style={styles.divider}>
                <p style={styles.secureNote}>
                  🔒 By registering, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>

          <p style={styles.footer}>© 2025 Admin Panel. All rights reserved.</p>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}

export default SuperAdminRegister;