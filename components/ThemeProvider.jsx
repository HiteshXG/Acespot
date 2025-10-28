"use client";
import { useEffect, useState } from 'react';

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const darkClass = document.documentElement.classList.contains('dark');
      setIsDark(darkClass);
    };

    checkTheme();
    setMounted(true);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      checkTheme();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Prevent hydration issues
  if (!mounted) {
    return <div style={{ backgroundColor: '#ffffff' }}>{children}</div>;
  }

  return (
    // <div 
    //   style={{
    //     backgroundColor: isDark ? '#111827' : '#ffffff',
    //     color: isDark ? '#e5e7eb' : '#1f2937',
    //     minHeight: '100vh',
    //     transition: 'background-color 0.3s ease, color 0.3s ease'
    //   }}
    // >
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
  {children}
</div>

    //   {children}
    // </div>
  );
};

export default ThemeProvider;