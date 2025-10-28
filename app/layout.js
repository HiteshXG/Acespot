import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import ThemeProvider from "@/components/ThemeProvider";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Acespot - hnxvrtxx",
  description: "E-Commerce with Next.js ",
};

const themeInitScript = `(function() {
  try {
    // 1) Check saved user preference
    var theme = localStorage.getItem('theme');
    if (!theme) {
      // 2) Default to light theme instead of system preference
      theme = 'light';
      localStorage.setItem('theme', 'light');
    }
    // Always remove dark class first, then add if needed
    document.documentElement.classList.remove('dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.warn('theme init error', e);
    // Fallback to light theme
    document.documentElement.classList.remove('dark');
  }
})();`;

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" >
        <body className={`${outfit.className} antialiased`} >
          <Script id="theme-init" strategy="beforeInteractive">
            {themeInitScript}
          </Script>
          <Toaster />
          <AppContextProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AppContextProvider>
        </body>
      </html>
      </ClerkProvider>
  );
}


