import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Jersey_25 } from 'next/font/google'
import './globals.css'
import Image from 'next/image'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const jersey25 = Jersey_25({
  variable: '--font-jersey-25',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Zap-A-Round',
  description: 'Donate a round of drinks at PubKey, New York.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jersey25.variable} antialiased`}
      >
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
          <header className="p-8 text-center">
            <Link href="/">
              <Image
                className="mx-auto dark:invert"
                src="/pubkey@2x.png"
                alt="PubKey logo"
                width={236}
                height={96}
                priority
              />
            </Link>
          </header>
          {children}
          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <a
              className="flex items-center justify-center gap-2 transition-opacity hover:opacity-50 sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="https://zaprite.com?developers?utm_source=pubkey&utm_campaign=zap-a-round"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/powered-by-zaprite.svg"
                alt="Powered by Zaprite logomark"
                width={156}
                height={20}
              />
            </a>
          </footer>
        </div>
      </body>
    </html>
  )
}
