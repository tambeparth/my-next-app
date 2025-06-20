// app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/app/Context/UserContext"
import { AuthProvider } from "@/context/AuthContext"
import GoogleMapsScript from "@/components/GoogleMapsScript"
import SuppressHydrationWarning from "@/components/SuppressHydrationWarning"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <UserProvider>
            <SuppressHydrationWarning>
              {children}
            </SuppressHydrationWarning>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

