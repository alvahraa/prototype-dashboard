import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

/**
 * LoginPage Component
 * 
 * Halaman login dengan wallpaper animasi yang berubah.
 * - Animated gradient background
 * - Floating particles effect
 * - Form login dengan validasi
 */

// Animated background styles (CSS-in-JS for component encapsulation)
const backgroundStyles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  animatedBg: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  formWrapper: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '420px',
    margin: '0 1rem',
  },
};

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Animated gradient backgrounds
  const backgrounds = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];

  // Auto-change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim()) {
      setError('Username tidak boleh kosong');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate login (replace with actual API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Demo: accept any credentials for now
      // In production, validate against API
      if (formData.username && formData.password) {
        onLogin?.({
          username: formData.username,
          name: formData.username.charAt(0).toUpperCase() + formData.username.slice(1),
        });
      }
    } catch {
      setError('Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={backgroundStyles.container}>
      {/* Animated Background */}
      <div
        style={{
          ...backgroundStyles.animatedBg,
          background: backgrounds[currentBgIndex],
          transition: 'background 1.5s ease-in-out',
        }}
      >
        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--delay': `${Math.random() * 5}s`,
                '--duration': `${8 + Math.random() * 10}s`,
                '--x-start': `${Math.random() * 100}%`,
                '--x-end': `${Math.random() * 100}%`,
                '--size': `${10 + Math.random() * 30}px`,
              }}
            />
          ))}
        </div>

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        />
      </div>

      {/* Login Form */}
      <div style={backgroundStyles.formWrapper}>
        <div className="login-card">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-black to-gray-800 mb-4 shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Prototype Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Dashboard Analytics System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="login-input pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="login-input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              © 2024 Prototype Dashboard • v1.0
            </p>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background: #fafafa;
        }

        .login-input:focus {
          outline: none;
          border-color: #000;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }

        .login-input::placeholder {
          color: #9ca3af;
        }

        .login-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #000 0%, #333 100%);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Floating Particles */
        .particles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          bottom: -50px;
          width: var(--size);
          height: var(--size);
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          left: var(--x-start);
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(calc(var(--x-end) - var(--x-start))) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
