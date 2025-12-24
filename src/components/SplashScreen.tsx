import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [logoScale, setLogoScale] = useState(false);

  useEffect(() => {
    // Simple fade in
    setTimeout(() => setLogoScale(true), 50);
    
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Logo with glow effect */}
        <div className="relative">
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-brand/30 blur-[60px] rounded-full"></div>
          
          {/* Logo container */}
          <div 
            className={`relative flex items-center justify-center w-40 h-40 transition-all duration-500 ${
              logoScale ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {/* Solid brand color background */}
            <div className="absolute inset-0 bg-brand rounded-2xl shadow-2xl"></div>
            
            {/* Taka symbol on top */}
            <div className="relative z-10 flex items-center justify-center">
              <span className="text-[120px] font-black text-black select-none leading-none">
                ৳
              </span>
            </div>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Expein
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Track your finances effortlessly
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2 mt-4">
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

