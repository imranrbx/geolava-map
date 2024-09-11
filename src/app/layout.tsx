'use client';

import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { AuthContextProvider } from '@/context/authContext';
import { InitContextProvider } from '@/context/initProvider';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <InitContextProvider>
      <AuthContextProvider>
        <html lang="en">
          <body className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </body>
          <link rel="icon" href="/chat/favicon.ico" sizes="any" />
        </html>
      </AuthContextProvider>
    </InitContextProvider>
  );
}
