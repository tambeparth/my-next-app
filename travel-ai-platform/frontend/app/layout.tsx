import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/app/Context/UserContext"
import { AuthProvider } from "@/context/AuthContext"
import SuppressHydrationWarning from "@/components/SuppressHydrationWarning"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart AI Trip Planner",
  description: "Plan your perfect trip with AI - Personalized itineraries, recommendations, and more",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SuppressHydrationWarning>
          <AuthProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </AuthProvider>
        </SuppressHydrationWarning>
      </body>
    </html>
  )
}

