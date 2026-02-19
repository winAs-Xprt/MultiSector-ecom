import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '../services/api';
import { setStoredAuth, getRememberMe, setRememberMe, isAuthenticated } from '../utils/storage';

const Login = () => {
  const navigate = useNavigate();
  
  const [currentState, setCurrentState] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otpId, setOtpId] = useState('');

  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMeState] = useState(false);

  
  const [otpEmail, setOtpEmail] = useState('');
  const [otpEmailError, setOtpEmailError] = useState('');


  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }

    const { remember, savedEmail } = getRememberMe();
    if (remember && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMeState(true);
    }
  }, [navigate]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.loginWithPassword(formData.email, formData.password);
      
      setStoredAuth(response);
      setRememberMe(formData.email, rememberMe);

      toast.success('Login successful!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      if (error.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.status === 0) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateOtpEmail = (emailValue) => {
    if (!emailValue) {
      setOtpEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setOtpEmailError('Email is invalid');
      return false;
    }
    setOtpEmailError('');
    return true;
  };

  const handleOtpEmailChange = (e) => {
    const value = e.target.value;
    setOtpEmail(value);
    if (otpEmailError) {
      setOtpEmailError('');
    }
  };

  const handleOtpLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateOtpEmail(otpEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.sendOTP(otpEmail);
      
      setOtpId(response.otpId);
      setUserEmail(otpEmail);
      setCurrentState('otpVerification');
      
      toast.success(response.message || 'OTP sent to your email!');
    } catch (error) {
      if (error.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.status === 404) {
        toast.error('Email not registered');
      } else if (error.status === 0) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otp = otpValues.join('');
    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(userEmail, otp);
      
      setStoredAuth(response);
      
      toast.success('Login successful!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      if (error.status === 401) {
        toast.error('Invalid OTP. Please try again.');
      } else if (error.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.status === 0) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Invalid OTP. Please try again.');
      }
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.sendOTP(userEmail);
      
      setOtpId(response.otpId);
      toast.success('OTP resent successfully!');
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      if (error.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to resend OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setCurrentState('login');
    setOtpEmail('');
    setOtpEmailError('');
    setOtpValues(['', '', '', '', '', '']);
    setUserEmail('');
    setOtpId('');
  };

  const renderFormHeader = () => {
    const headers = {
      login: { title: 'Admin Login', subtitle: 'Sign in to your admin account' },
      otpLogin: { title: 'Login with OTP', subtitle: 'Enter your email to receive OTP' },
      otpVerification: { title: 'Verify OTP', subtitle: 'Enter the code sent to your email' },
    };

    const header = headers[currentState];

    return (
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-2">
          {header.title}
        </h1>
        <p className="text-gray-600 text-base">
          {header.subtitle}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-pink-100 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {renderFormHeader()}

        
        <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 p-8 backdrop-blur-sm">
          
      
          {currentState === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-pink-400 text-lg" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-11 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-gray-700 ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
                    }`}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-pink-400 text-lg" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-11 pr-11 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-gray-700 ${
                      errors.password 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-400 hover:text-pink-600 transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMeState(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                      rememberMe 
                        ? 'bg-pink-500 border-pink-500' 
                        : 'bg-white border-gray-300 group-hover:border-pink-400'
                    }`}>
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setCurrentState('otpLogin')}
                  className="text-pink-600 hover:text-pink-700 font-medium text-sm underline decoration-pink-300 hover:decoration-pink-500 transition-all duration-200"
                >
                  Login with OTP
                </button>
              </div>

              
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 border-2 border-pink-200 rounded-lg p-4">
                <p className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                  <span className="mr-2">🔑</span> Demo Credentials:
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Email:</span> <strong className="text-pink-600">admin@gmail.com</strong>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Password:</span> <strong className="text-pink-600">Password@123</strong>
                  </p>
                </div>
              </div>

              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block w-5 h-5 border-4 border-pink-200 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="text-lg" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}
          {currentState === 'otpLogin' && (
            <form onSubmit={handleOtpLoginSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="otpEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-pink-400 text-lg" />
                  </div>
                  <input
                    type="email"
                    id="otpEmail"
                    value={otpEmail}
                    onChange={handleOtpEmailChange}
                    className={`w-full px-4 py-3 pl-11 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-gray-700 ${
                      otpEmailError 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {otpEmailError && (
                  <p className="text-red-500 text-sm mt-1 font-medium">{otpEmailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block w-5 h-5 border-4 border-pink-200 border-t-white rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="text-lg" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full bg-white text-pink-600 border-2 border-pink-500 font-semibold py-3 px-6 rounded-lg hover:bg-pink-50 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FaArrowLeft className="text-lg" />
                <span>Back to Login</span>
              </button>
            </form>
          )}
          {currentState === 'otpVerification' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">We've sent a 6-digit verification code to</p>
                <p className="text-base font-semibold text-pink-600">{userEmail}</p>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-3">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-200 transition-all duration-300 text-gray-700"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-pink-600 hover:text-pink-700 font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block w-5 h-5 border-4 border-pink-200 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-lg" />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full bg-white text-pink-600 border-2 border-pink-500 font-semibold py-3 px-6 rounded-lg hover:bg-pink-50 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FaArrowLeft className="text-lg" />
                <span>Back to Login</span>
              </button>
            </form>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
