import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-1000">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full"></div>
          <div className="relative flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-3xl border-2 border-brand/30 shadow-2xl">
            <span className="text-7xl font-bold text-brand">E</span>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Expein
          </h1>
          <p className="text-sm text-gray-400">
            Track your finances effortlessly
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

