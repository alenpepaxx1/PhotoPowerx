/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhotoPower — Advanced Photo & Video Studio | Created by Alen Pepa',
  description: 'Professional Photoshop-grade Photo & Video Editing Suite by Alen Pepa. Multi-layer composition, advanced color grading, AI enhancements, retouching, video timeline, and high-res export.',
  authors: [{ name: 'Alen Pepa' }],
  creator: 'Alen Pepa',
  publisher: 'Alen Pepa',
  openGraph: {
    title: 'PhotoPower — Advanced Photo & Video Studio by Alen Pepa',
    description: 'Professional Photoshop-grade Photo & Video Editing Suite by Alen Pepa.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhotoPower — Advanced Photo & Video Studio by Alen Pepa',
    description: 'Professional Photoshop-grade Photo & Video Editing Suite by Alen Pepa.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <meta name="author" content="Alen Pepa" />
        <meta name="copyright" content="PhotoPower © 2026 Alen Pepa" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Anton&family=Bebas+Neue&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Caveat:wght@400..700&family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Dancing+Script:wght@400..700&family=Fira+Code:wght@400..700&family=Inter:wght@300;400;600;700;900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:wght@300;400;600;700;900&family=Orbitron:wght@400..900&family=Oswald:wght@400..700&family=Pacifico&family=Poppins:wght@300;400;600;700;900&family=Press+Start+2P&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Raleway:wght@400..900&family=Righteous&family=Satisfy&family=Space+Grotesk:wght@400..700&family=Syne:wght@400..800&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="h-full bg-[#050505] text-[#E0E0E0] antialiased overflow-hidden select-none font-sans">
        {children}
      </body>
    </html>
  );
}
