import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CapTable AI — SBA Underwriting Intelligence',
  description: 'AI-powered financial analysis for SBA lenders. Automates business valuation, document generation, and financial narrative work for SBA 7(a) loan underwriting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
