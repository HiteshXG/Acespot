"use client";
import React, { useEffect, useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import Image from "next/image";

import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();

  const [theme, setTheme] = useState("light");
  
  // Debug: log theme changes
  useEffect(() => {
    console.log('Navbar theme state:', theme);
  }, [theme]);

  useEffect(() => {
    // Read saved theme (if any) or detect system preference
    try {
      const saved = localStorage.getItem("theme");
      if (saved) {
        setTheme(saved);
        if (saved === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // Default to light theme instead of system preference
        setTheme("light");
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (e) {
      console.warn("could not read theme", e);
      // Fallback to light theme
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      // ignore
    }
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav 
      className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b h-16"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
      }}
    >
      <Image
        className="cursor-pointer w-30 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors">
          Shop
        </Link>
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
          About us
        </Link>
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
          Contact us
        </Link>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Seller Dashboard
          </button>
        )}
      </div>
      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          className="p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? 
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')}/>
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')}/>
              </UserButton.MenuItems>
            </UserButton>
          </>
        :
          <button
            className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
            onClick={openSignIn}
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        }
      </ul>
      <div className="flex items-center gap md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Seller Dashboard
          </button>
        )}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          className="p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? 
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')}/>
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/shop')}/>
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')}/>
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')}/>
              </UserButton.MenuItems>
            </UserButton>
          </>
        :
          <button
            className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
            onClick={openSignIn}
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        }
      </div>
    </nav>
  );
};

export default Navbar;
