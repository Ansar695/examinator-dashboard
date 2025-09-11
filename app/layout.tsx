import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { Suspense } from "react"
import "./globals.css"

const geistSans = GeistSans.variable
const geistMono = GeistMono.variable

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans} ${geistMono} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <ReduxProvider>{children}</ReduxProvider>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
