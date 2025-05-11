// src/app/layout.tsx
import './globals.css'   // Tailwind imports
import { ReactNode } from 'react'
import { LanguageProvider } from '@/context/LanguageProvider'

export const metadata = {
  title: 'Probashi',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
