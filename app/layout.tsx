import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Autoescuelas.ar - Encuentra tu escuela de manejo en Argentina',
  description: 'El directorio más completo de escuelas de manejo en Argentina. Encuentra la autoescuela perfecta para obtener tu licencia de conducir. Busca por provincia, ciudad y calificaciones.',
  keywords: 'autoescuelas, escuela de manejo, licencia de conducir, Argentina, aprender a manejar, clases de manejo',
  authors: [{ name: 'Autoescuelas.ar' }],
  creator: 'Autoescuelas.ar',
  publisher: 'Autoescuelas.ar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.autoescuelas.ar'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Autoescuelas.ar - Encuentra tu escuela de manejo en Argentina',
    description: 'El directorio más completo de escuelas de manejo en Argentina. Encuentra la autoescuela perfecta para obtener tu licencia de conducir.',
    url: 'https://www.autoescuelas.ar',
    siteName: 'Autoescuelas.ar',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Autoescuelas.ar - Directorio de escuelas de manejo en Argentina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autoescuelas.ar - Encuentra tu escuela de manejo en Argentina',
    description: 'El directorio más completo de escuelas de manejo en Argentina. Encuentra la autoescuela perfecta para obtener tu licencia de conducir.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
