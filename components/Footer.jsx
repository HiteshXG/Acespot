"use client";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";

const Footer = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <footer 
      style={{
        backgroundColor: isDark ? '#111827' : '#ffffff'
      }}
    >
      <div 
        className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-12 border-t border-b"
        style={{
          borderTopColor: isDark ? '#374151' : '#d1d5db',
          borderBottomColor: isDark ? '#374151' : '#d1d5db',
          color: isDark ? '#d1d5db' : '#4b5563'
        }}
      >
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-2 text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 
              className="font-medium mb-5"
              style={{ color: isDark ? '#f9fafb' : '#111827' }}
            >
              Company
            </h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors" href="#">
                  About us
                </a>
              </li>
              <li>
                <a className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors" href="#">
                  Contact us
                </a>
              </li>
              <li>
                <a className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors" href="#">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
        <div>
          <h2 
            className="font-medium"
            style={{ color: isDark ? '#f9fafb' : '#111827' }}
          >
            Get in touch
          </h2>
          <div className="text-sm space-y-2">
            <p>+1-234-567-890</p>
            <p>contact@hnxvrtxx.dev</p>
          </div>
        </div>
        </div>
      </div>
      <div style={{ backgroundColor: isDark ? '#111827' : '#ffffff' }}>
        <p 
          className="py-4 text-center text-xs md:text-sm"
          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
        >
          Copyright 2025 © GreatStack.dev All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
