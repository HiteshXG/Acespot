'use client'

import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const AllProducts = () => {
  const { products } = useAppContext();
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

  return(
    <div 
      style={{
        backgroundColor: isDark ? '#111827' : '#ffffff',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Navbar/>
      <div 
        className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-screen"
        style={{
          backgroundColor: isDark ? '#111827' : '#ffffff'
        }}
      >
      <div className="flex flex-col items-end pt-12">
        <p 
          className="text-2xl font-medium"
          style={{ color: isDark ? '#f3f4f6' : '#111827' }}
        >
          All Products
        </p>
        <div className="w-16 h-0.5 bg-blue-950 dark:bg-blue-400 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
        {products.map((product, index) => <ProductCard key={index} product={product}/>)}
      </div>
      </div>
      <Footer/>
    </div>
  )
}

export default AllProducts;