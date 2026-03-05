import { useState } from 'react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from './baseurl';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function SuperAdminReset() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) return;
      setIsLoading(true);
      let response = await axios.post(`${BASE_URL}/resetPassword`, { email, password: newPassword });
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSuccess(true);
      setIsLoading(false);
      toast.success(response.data.message, { containerId: 'adminResetPage' });
      navigate('/adminLogin');
    } catch (e) {
      setIsLoading(false);
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: 'adminResetPage' });
      } else {
        toast.error('Error occured while trying to reset password', { containerId: 'adminResetPage' });
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
    // Purple header (reset form)
    cardHeaderPurple: {
      background: 'linear-gradient(90deg, #9333ea, #6b21a8)',
      padding: '40px 32px',
      textAlign: 'center',
    },
    // Green header (success screen)
    cardHeaderGreen: {
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
    successIconWrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff',
      margin: '0 0 8px 0',
    },
    cardSubtitlePurple: {
      color: '#e9d5ff',
      fontSize: '14px',
      margin: 0,
    },
    cardSubtitleGreen: {
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
      marginBottom: '24px',
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
      transition: 'border-color 0.2s',
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
      transition: 'border-color 0.2s',
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
      background: 'linear-gradient(90deg, #9333ea, #6b21a8)',
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
      transition: 'opacity 0.2s',
    }),
    successButton: {
      width: '100%',
      background: 'linear-gradient(90deg, #9333ea, #6b21a8)',
      color: '#ffffff',
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      boxSizing: 'border-box',
      textAlign: 'center',
    },
    successText: {
      color: '#4b5563',
      fontSize: '14px',
      marginBottom: '24px',
      lineHeight: '1.6',
    },
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

  // ── Success screen ──────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div style={styles.page}>
        <div style={styles.bgBlob1} />
        <div style={styles.bgBlob2} />
        <div style={styles.bgBlob3} />

        <div style={styles.cardWrapper}>
          <div style={styles.card}>
            <div style={styles.cardHeaderGreen}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={styles.successIconWrapper}>
                  <svg width="32" height="32" fill="none" stroke="#16a34a" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 style={styles.cardTitle}>Password Reset Successful</h1>
              <p style={styles.cardSubtitleGreen}>Your password has been updated</p>
            </div>

            <div style={{ ...styles.cardBody, textAlign: 'center' }}>
              <p style={styles.successText}>
                Your password for <strong>{email}</strong> has been successfully reset. You can now log in with your new password.
              </p>
              <Link to="/" style={styles.successButton}>Back to Login</Link>
            </div>

            <div style={{ padding: '0 32px 40px' }}>
              <div style={styles.divider}>
                <p style={styles.secureNote}>🔒 Keep your password secure and don't share it with anyone.</p>
              </div>
            </div>
          </div>

          <p style={styles.footer}>© 2025 Admin Panel. All rights reserved.</p>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Reset form ──────────────────────────────────────────────────
  return (
    <>
      <ToastContainer containerId="adminResetPage" />

      <div style={styles.page}>
        <div style={styles.bgBlob1} />
        <div style={styles.bgBlob2} />
        <div style={styles.bgBlob3} />

        <div style={styles.cardWrapper}>
          <div style={styles.card}>
            {/* Header */}
            <div style={styles.cardHeaderPurple}>
              <div style={styles.logoWrapper}>
                <img src="./logo.jpg" alt="Company Logo" style={styles.logo} />
              </div>
              <h1 style={styles.cardTitle}>Reset Password</h1>
              <p style={styles.cardSubtitlePurple}>Enter your details to reset your password</p>
            </div>

            {/* Body */}
            <div style={styles.cardBody}>
              <Link to="/" style={styles.backButton}>
                <ArrowLeft size={16} />
                Back to Login
              </Link>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Mail size={20} /></span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
                    placeholder="admin@example.com"
                    style={styles.input(!!errors.email)}
                  />
                </div>
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>

              {/* New Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>New Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Lock size={20} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); if (errors.newPassword) setErrors({ ...errors, newPassword: '' }); }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    placeholder="Enter new password"
                    style={styles.inputWithEye(!!errors.newPassword)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && <p style={styles.errorText}>{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Lock size={20} /></span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }); }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    placeholder="Confirm new password"
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
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <div style={styles.divider}>
                <p style={styles.secureNote}>🔒 Password must be at least 8 characters long.</p>
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

export default SuperAdminReset;