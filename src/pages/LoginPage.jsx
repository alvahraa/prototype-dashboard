import React, { useState } from 'react';
import { Library, Lock, User, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

/**
 * LoginPage - Premium Redesign (Monochrome Theme)
 * 
 * Design Features:
 * - Mesh gradient background with dark theme
 * - Glassmorphism card with backdrop blur
 * - Asymmetric layout with decorative elements
 * - Micro-interactions on inputs and buttons
 * - Consistent with dashboard color scheme (black/white)
 */

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
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
    <div className="relative min-h-screen overflow-hidden font-sans">
      
      {/* ========== DARK MESH GRADIENT BACKGROUND ========== */}
      <div className="absolute inset-0 bg-black">
        {/* Organic Blob Shapes - Grayscale */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-r from-gray-700/50 to-gray-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-gradient-to-r from-gray-600/30 to-gray-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* ========== MAIN CONTENT - ASYMMETRIC LAYOUT ========== */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 lg:justify-end lg:pr-[12%]">
        
        {/* Left Side Decorative Text (Desktop Only) */}
        <div className="hidden lg:block absolute left-[8%] top-1/2 -translate-y-1/2">
          <div className="text-white/[0.03] text-[200px] font-black leading-none select-none">
            LIB
          </div>
          <div className="mt-4 text-white/30 text-sm tracking-widest uppercase">
            Analytics Dashboard
          </div>
        </div>

        {/* ========== GLASSMORPHISM LOGIN CARD ========== */}
        <div className="w-full max-w-md animate-slideUp">
          
          {/* Glass Card - Dark Theme */}
          <div className="relative backdrop-blur-xl bg-white/[0.08] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
            
            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
            
            {/* Avatar & Greeting */}
            <div className="text-center mb-8">
              {/* Avatar with Custom Image */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-gray-600 to-gray-400 animate-spin-slow opacity-30 blur-sm" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg shadow-black/30 border-2 border-white/20">
                  <img 
                    src="/images/assets/logo.jpg" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-800">
                  <Sparkles className="w-3 h-3 text-black" />
                </div>
              </div>
              
              {/* Welcoming Text */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Selamat Datang
              </h1>
              <p className="text-gray-400 text-sm">
                Masuk ke Prototype Dashboard Analytics
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'username' ? 'text-white' : 'text-gray-500'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    className={`
                      w-full pl-12 pr-4 py-4 
                      bg-white/5 border-2 rounded-xl
                      text-white placeholder-gray-500
                      transition-all duration-300 ease-out
                      focus:outline-none focus:bg-white/10
                      ${focusedField === 'username' 
                        ? 'border-white/40 shadow-lg shadow-white/5 scale-[1.02]' 
                        : 'border-white/10 hover:border-white/20'}
                    `}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'password' ? 'text-white' : 'text-gray-500'}`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    className={`
                      w-full pl-12 pr-12 py-4 
                      bg-white/5 border-2 rounded-xl
                      text-white placeholder-gray-500
                      transition-all duration-300 ease-out
                      focus:outline-none focus:bg-white/10
                      ${focusedField === 'password' 
                        ? 'border-white/40 shadow-lg shadow-white/5 scale-[1.02]' 
                        : 'border-white/10 hover:border-white/20'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
                  {error}
                </div>
              )}

              {/* Submit Button - Black/White Theme */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  relative w-full py-4 px-6 mt-2
                  bg-white text-black
                  font-semibold text-base
                  rounded-xl overflow-hidden
                  transition-all duration-300 ease-out
                  hover:bg-gray-100 hover:shadow-xl hover:shadow-white/10 hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                  group
                `}
              >
                {/* Shine Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Masuk ke Dashboard</span>
                  )}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-500 text-xs">
                Prototype Dashboard v1.0 • Library Analytics
              </p>
            </div>
          </div>

          {/* Bottom Decorative */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-xs">
              Built with React & Tailwind CSS
            </p>
          </div>
        </div>
      </div>

      {/* ========== CUSTOM ANIMATIONS ========== */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0.4;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
