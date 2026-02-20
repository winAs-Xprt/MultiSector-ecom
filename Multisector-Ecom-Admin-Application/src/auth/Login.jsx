import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaSignInAlt, FaCheckCircle, FaArrowLeft, FaMobileAlt
} from 'react-icons/fa';
import { authAPI } from '../services/api';
import { setStoredAuth, getRememberMe, setRememberMe, isAuthenticated } from '../utils/storage';

// ─── Field Error ──────────────────────────────────────────────────────────────
const FieldError = ({ error }) =>
  error ? (
    <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span>⚠</span> {error}
    </p>
  ) : null;

// ─── Input style helpers ──────────────────────────────────────────────────────
const iBase = (err) => ({
  width: '100%',
  padding: '11px 14px 11px 40px',
  fontSize: '13.5px',
  fontWeight: 500,
  color: '#111827',
  background: err ? '#fff8f8' : '#fafafa',
  border: `1.5px solid ${err ? '#fca5a5' : '#efefef'}`,
  borderRadius: '10px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'all 0.18s',
  boxSizing: 'border-box',
});

const onFocus = (e) => {
  e.target.style.borderColor = '#ec4899';
  e.target.style.background  = '#fff';
  e.target.style.boxShadow   = '0 0 0 3px rgba(236,72,153,0.1)';
};
const onBlur = (e, err) => {
  e.target.style.borderColor = err ? '#fca5a5' : '#efefef';
  e.target.style.background  = err ? '#fff8f8' : '#fafafa';
  e.target.style.boxShadow   = 'none';
};

// ─── Label ────────────────────────────────────────────────────────────────────
const Label = ({ text }) => (
  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px', display: 'block' }}>
    {text}
  </label>
);

// ─── Submit Button ────────────────────────────────────────────────────────────
const SubmitBtn = ({ loading, label, loadingLabel, icon }) => (
  <button
    type="submit"
    disabled={loading}
    style={{
      width: '100%', padding: '11px', fontSize: '14px', fontWeight: 700,
      color: '#fff', background: loading ? '#f9a8d4' : 'linear-gradient(135deg,#ec4899,#db2777)',
      border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '8px', boxShadow: loading ? 'none' : '0 4px 14px rgba(236,72,153,0.3)',
      transition: 'all 0.18s', letterSpacing: '0.1px',
    }}
    onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,72,153,0.4)'; } }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 14px rgba(236,72,153,0.3)'; }}
  >
    {loading ? (
      <>
        <div style={{ width: '16px', height: '16px', border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
        {loadingLabel}
      </>
    ) : (
      <>
        <span style={{ fontSize: '13px' }}>{icon}</span>
        {label}
      </>
    )}
  </button>
);

// ─── Back Button ──────────────────────────────────────────────────────────────
const BackBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: '100%', padding: '10px', fontSize: '13.5px', fontWeight: 600,
      color: '#6b7280', background: '#fafafa', border: '1.5px solid #efefef',
      borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
      transition: 'all 0.18s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#efefef'; e.currentTarget.style.color = '#6b7280'; }}
  >
    <FaArrowLeft style={{ fontSize: '11px' }} /> Back to Login
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();

  const [currentState, setCurrentState]   = useState('login');
  const [isLoading,    setIsLoading]       = useState(false);
  const [userEmail,    setUserEmail]       = useState('');
  const [otpId,        setOtpId]           = useState('');

  const [formData,      setFormData]       = useState({ email: '', password: '' });
  const [showPassword,  setShowPassword]   = useState(false);
  const [errors,        setErrors]         = useState({});
  const [rememberMe,    setRememberMeState]= useState(false);

  const [otpEmail,      setOtpEmail]       = useState('');
  const [otpEmailError, setOtpEmailError]  = useState('');
  const [otpValues,     setOtpValues]      = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (isAuthenticated()) navigate('/dashboard');
    const { remember, savedEmail } = getRememberMe();
    if (remember && savedEmail) {
      setFormData(p => ({ ...p, email: savedEmail }));
      setRememberMeState(true);
    }
  }, [navigate]);

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.email)                          e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email  = 'Email is invalid';
    if (!formData.password)                        e.password = 'Password is required';
    else if (formData.password.length < 6)         e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error('Please fix the errors'); return; }
    setIsLoading(true);
    try {
      const res = await authAPI.loginWithPassword(formData.email, formData.password);
      setStoredAuth(res);
      setRememberMe(formData.email, rememberMe);
      toast.success('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      if (err.status === 401)   toast.error('Invalid email or password');
      else if (err.status === 500) toast.error('Server error. Try again later.');
      else if (err.status === 0)   toast.error('Network error. Check your connection.');
      else toast.error(err.message || 'Login failed.');
    } finally { setIsLoading(false); }
  };

  const validateOtpEmail = (val) => {
    if (!val)                         { setOtpEmailError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(val))   { setOtpEmailError('Email is invalid');  return false; }
    setOtpEmailError(''); return true;
  };

  const handleOtpLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateOtpEmail(otpEmail)) { toast.error('Enter a valid email'); return; }
    setIsLoading(true);
    try {
      const res = await authAPI.sendOTP(otpEmail);
      setOtpId(res.otpId);
      setUserEmail(otpEmail);
      setCurrentState('otpVerification');
      toast.success(res.message || 'OTP sent!');
    } catch (err) {
      if (err.status === 404) toast.error('Email not registered');
      else toast.error(err.message || 'Failed to send OTP.');
    } finally { setIsLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpValues];
    next[index] = value;
    setOtpValues(next);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0)
      otpInputRefs.current[index - 1]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length !== 6) { toast.error('Enter complete OTP'); return; }
    setIsLoading(true);
    try {
      const res = await authAPI.verifyOTP(userEmail, otp);
      setStoredAuth(res);
      toast.success('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.status === 401 ? 'Invalid OTP.' : err.message || 'Verification failed.');
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await authAPI.sendOTP(userEmail);
      setOtpId(res.otpId);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
      toast.success('OTP resent!');
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP.');
    } finally { setIsLoading(false); }
  };

  const handleBackToLogin = () => {
    setCurrentState('login');
    setOtpEmail(''); setOtpEmailError('');
    setOtpValues(['', '', '', '', '', '']);
    setUserEmail(''); setOtpId('');
  };

  // ── Page titles ──
  const headers = {
    login:           { title: 'Welcome back',      subtitle: 'Sign in to your admin account' },
    otpLogin:        { title: 'Login with OTP',    subtitle: 'Enter your email to receive a code' },
    otpVerification: { title: 'Check your email',  subtitle: `Code sent to ${userEmail}` },
  };
  const h = headers[currentState];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#fafafa', position: 'relative', overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* Blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%',  left: '5%',  width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', animation: 'blob 8s infinite' }} />
        <div style={{ position: 'absolute', top: '50%',  right: '5%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(219,39,119,0.1) 0%, transparent 70%)',  animation: 'blob 10s infinite 2s' }} />
        <div style={{ position: 'absolute', bottom: '5%',left: '20%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,168,212,0.15) 0%, transparent 70%)', animation: 'blob 9s infinite 4s' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>

        {/* ── Brand ───────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#ec4899,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 6px 20px rgba(236,72,153,0.3)' }}>
            <i className="fas fa-shopping-bag" style={{ color: '#fff', fontSize: '20px' }} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', margin: '0 0 4px' }}>
            {h.title}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#9ca3af', fontWeight: 500 }}>
            {h.subtitle}
          </p>
        </div>

        {/* ── Card ────────────────────────────────────────────────────── */}
        <div style={{
          background: '#fff', borderRadius: '18px', padding: '30px 28px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 8px 40px rgba(236,72,153,0.08), 0 2px 12px rgba(0,0,0,0.06)',
        }}>

          {/* ── Password Login ─────────────────────────────────────── */}
          {currentState === 'login' && (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Email */}
              <div>
                <Label text="Email Address" />
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', fontSize: '13px', pointerEvents: 'none' }} />
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="admin@example.com"
                    autoComplete="email"
                    style={iBase(errors.email)}
                    onFocus={onFocus} onBlur={e => onBlur(e, errors.email)}
                  />
                </div>
                <FieldError error={errors.email} />
              </div>

              {/* Password */}
              <div>
                <Label text="Password" />
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', fontSize: '13px', pointerEvents: 'none' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password" value={formData.password}
                    onChange={handleChange} placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ ...iBase(errors.password), paddingRight: '42px' }}
                    onFocus={onFocus} onBlur={e => onBlur(e, errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ec4899'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                  >
                    {showPassword ? <FaEyeSlash style={{ fontSize: '14px' }} /> : <FaEye style={{ fontSize: '14px' }} />}
                  </button>
                </div>
                <FieldError error={errors.password} />
              </div>

              {/* Remember me + OTP switch */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Custom checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <div
                    onClick={() => setRememberMeState(p => !p)}
                    style={{
                      width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                      border: `1.5px solid ${rememberMe ? '#ec4899' : '#d1d5db'}`,
                      background: rememberMe ? '#ec4899' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.18s', cursor: 'pointer',
                    }}
                  >
                    {rememberMe && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setCurrentState('otpLogin')}
                  style={{ fontSize: '13px', fontWeight: 600, color: '#ec4899', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#db2777'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ec4899'}
                >
                  Login with OTP
                </button>
              </div>

              {/* Demo credentials */}
              <div style={{ padding: '13px 15px', background: '#fdf2f8', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  🔑 Demo Credentials
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <p style={{ fontSize: '12.5px', color: '#6b7280', margin: 0 }}>
                    Email: <strong style={{ color: '#ec4899' }}>admin@gmail.com</strong>
                  </p>
                  <p style={{ fontSize: '12.5px', color: '#6b7280', margin: 0 }}>
                    Password: <strong style={{ color: '#ec4899' }}>Password@123</strong>
                  </p>
                </div>
              </div>

              <SubmitBtn loading={isLoading} label="Sign In" loadingLabel="Signing in..." icon={<FaSignInAlt />} />
            </form>
          )}

          {/* ── OTP Email Entry ────────────────────────────────────── */}
          {currentState === 'otpLogin' && (
            <form onSubmit={handleOtpLoginSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Icon */}
              <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fdf2f8', border: '1.5px solid #fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <FaMobileAlt style={{ color: '#ec4899', fontSize: '22px' }} />
                </div>
              </div>

              <div>
                <Label text="Email Address" />
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', fontSize: '13px', pointerEvents: 'none' }} />
                  <input
                    type="email" value={otpEmail}
                    onChange={e => { setOtpEmail(e.target.value); if (otpEmailError) setOtpEmailError(''); }}
                    placeholder="admin@example.com"
                    style={iBase(otpEmailError)}
                    onFocus={onFocus} onBlur={e => onBlur(e, otpEmailError)}
                  />
                </div>
                <FieldError error={otpEmailError} />
              </div>

              <SubmitBtn loading={isLoading} label="Send OTP" loadingLabel="Sending..." icon={<FaSignInAlt />} />
              <BackBtn onClick={handleBackToLogin} />
            </form>
          )}

          {/* ── OTP Verification ───────────────────────────────────── */}
          {currentState === 'otpVerification' && (
            <form onSubmit={handleVerifyOtp} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Email indicator */}
              <div style={{ textAlign: 'center', padding: '13px', background: '#fdf2f8', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 3px', fontWeight: 500 }}>Code sent to</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#ec4899', margin: 0 }}>{userEmail}</p>
              </div>

              {/* OTP Inputs */}
              <div>
                <Label text="Enter 6-digit code" />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputRefs.current[idx] = el}
                      type="text"
                      maxLength="1"
                      value={val}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      autoComplete="off"
                      style={{
                        width: '44px', height: '52px', textAlign: 'center',
                        fontSize: '20px', fontWeight: 800, color: '#111827',
                        background: val ? '#fdf2f8' : '#fafafa',
                        border: `1.5px solid ${val ? '#ec4899' : '#efefef'}`,
                        borderRadius: '10px', outline: 'none',
                        fontFamily: 'inherit', transition: 'all 0.18s',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = val ? '#ec4899' : '#efefef'; e.target.style.background = val ? '#fdf2f8' : '#fafafa'; e.target.style.boxShadow = 'none'; }}
                    />
                  ))}
                </div>
              </div>

              {/* Resend */}
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                Didn't receive it?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899', background: 'none', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: isLoading ? 0.5 : 1 }}
                  onMouseEnter={e => { if (!isLoading) e.currentTarget.style.color = '#db2777'; }}
                  onMouseLeave={e => e.currentTarget.style.color = '#ec4899'}
                >
                  Resend OTP
                </button>
              </p>

              <SubmitBtn loading={isLoading} label="Verify & Sign In" loadingLabel="Verifying..." icon={<FaCheckCircle />} />
              <BackBtn onClick={handleBackToLogin} />
            </form>
          )}

        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '20px', fontWeight: 500 }}>
          MultiEcom Admin Panel · Secured Access
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blob {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(20px,-30px) scale(1.08); }
          66%  { transform: translate(-15px,15px) scale(0.94); }
          100% { transform: translate(0,0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Login;
