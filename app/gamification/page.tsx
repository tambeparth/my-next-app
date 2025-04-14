// app/gamification/page.tsx
"use client"

import { useUser } from "@/app/Context/UserContext"
import { ArrowRight, Award, Clock, Compass, Crown, Flag, Globe, Map, Mountain, Star, Trophy, User } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import Image from "next/image"

export default function GamificationPage() {
    const { userPoints, badges } = useUser()
    const [tab, setTab] = useState<"achievements" | "rewards" | "leaderboard">("achievements")

    const handleRedeemReward = (reward: { name: string, cost: number }) => {
        if (userPoints >= reward.cost) {
            alert(`You redeemed: ${reward.name}`)
        } else {
            alert("Not enough points!")
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                    <div className="flex gap-2 items-center text-primary">
                        <Globe className="h-6 w-6" />
                        <Link href="/" className="text-xl font-bold">
                            Smart AI Trip Planner
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link href="/chatbot" className="text-sm font-medium transition-colors hover:text-primary mx-4">
                            AI Chatbot
                        </Link>
                        <Link
                            href="/game"
                            className="inline-flex items-center text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90"
                        >
                            Play Game
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-6 md:py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Travel Rewards & Achievements</h1>
                        <p className="text-muted-foreground mt-1">Earn points, unlock badges, and climb the leaderboard!</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">Your Points</div>
                            <div className="text-2xl font-bold text-primary">{userPoints}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs and other content */}
            </main>

            <footer className="w-full border-t bg-background py-6">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
                    <div className="flex items-center gap-2 text-primary">
                        <Globe className="h-5 w-5" />
                        <span className="text-lg font-bold">Smart AI Trip Planner</span>
                    </div>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link href="#" className="text-sm hover:underline underline-offset-4">
                            Privacy
                        </Link>
                        <Link href="#" className="text-sm hover:underline underline-offset-4">
                            Terms
                        </Link>
                        <Link href="#" className="text-sm hover:underline underline-offset-4">
                            Contact
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}