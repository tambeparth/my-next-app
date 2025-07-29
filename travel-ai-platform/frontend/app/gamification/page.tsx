// app/gamification/page.tsx
"use client"

import { useUser } from "@/app/Context/UserContext"
import { ArrowRight, Award, Clock, Compass, Crown, Flag, Globe, Map, Mountain, Palmtree, Plane, Star, Trophy, User } from "lucide-react"
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

    // Travel-themed achievements
    const travelAchievements = [
        {
            id: 1,
            name: "First Steps",
            description: "Complete your first trip planning",
            icon: <Compass className="h-8 w-8 text-blue-500" />,
            points: 50,
            unlocked: true
        },
        {
            id: 2,
            name: "Globe Trotter",
            description: "Plan trips to 5 different countries",
            icon: <Globe className="h-8 w-8 text-green-500" />,
            points: 200,
            unlocked: false
        },
        {
            id: 3,
            name: "Adventure Seeker",
            description: "Include an adventure activity in your trip",
            icon: <Mountain className="h-8 w-8 text-amber-500" />,
            points: 100,
            unlocked: true
        },
        {
            id: 4,
            name: "Beach Lover",
            description: "Plan a trip to a coastal destination",
            icon: <Palmtree className="h-8 w-8 text-yellow-500" />,
            points: 75,
            unlocked: false
        },
        {
            id: 5,
            name: "Game Master",
            description: "Score 500 points in travel games",
            icon: <Trophy className="h-8 w-8 text-purple-500" />,
            points: 250,
            unlocked: false
        }
    ]

    // Travel-themed rewards
    const travelRewards = [
        {
            id: 1,
            name: "Premium Destination Guide",
            description: "Unlock detailed guides for popular destinations",
            cost: 300,
            icon: <Map className="h-8 w-8 text-indigo-500" />
        },
        {
            id: 2,
            name: "Travel Itinerary Templates",
            description: "Access to premium itinerary templates",
            cost: 500,
            icon: <Clock className="h-8 w-8 text-emerald-500" />
        },
        {
            id: 3,
            name: "Flight Discount Voucher",
            description: "10% off on your next flight booking",
            cost: 1000,
            icon: <Plane className="h-8 w-8 text-sky-500" />
        }
    ]

    // Leaderboard data
    const leaderboardData = [
        { id: 1, name: "TravelMaster", points: 2450, avatar: "/avatars/user1.png" },
        { id: 2, name: "GlobeTrotter", points: 2100, avatar: "/avatars/user2.png" },
        { id: 3, name: "Wanderlust", points: 1850, avatar: "/avatars/user3.png" },
        { id: 4, name: "You", points: userPoints, avatar: "/avatars/default.png", isCurrentUser: true },
        { id: 5, name: "AdventureSeeker", points: 1200, avatar: "/avatars/user4.png" }
    ].sort((a, b) => b.points - a.points);

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
                            Play Travel Games
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

                {/* Tabs navigation */}
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setTab("achievements")}
                        className={`px-4 py-2 font-medium ${tab === "achievements"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Achievements
                    </button>
                    <button
                        onClick={() => setTab("rewards")}
                        className={`px-4 py-2 font-medium ${tab === "rewards"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Rewards
                    </button>
                    <button
                        onClick={() => setTab("leaderboard")}
                        className={`px-4 py-2 font-medium ${tab === "leaderboard"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Leaderboard
                    </button>
                </div>

                {/* Tab content */}
                <div className="mt-6">
                    {tab === "achievements" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {travelAchievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`border rounded-lg p-4 ${achievement.unlocked
                                            ? "bg-primary/5 border-primary/20"
                                            : "bg-muted/30 border-muted opacity-70"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-primary/10" : "bg-muted"}`}>
                                            {achievement.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                {achievement.name}
                                                {achievement.unlocked && <Award className="h-4 w-4 text-amber-500" />}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">{achievement.description}</p>
                                            <div className="mt-2 text-sm font-medium">
                                                {achievement.unlocked
                                                    ? <span className="text-green-600">Unlocked: +{achievement.points} points</span>
                                                    : <span>Reward: {achievement.points} points</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "rewards" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {travelRewards.map((reward) => (
                                <div key={reward.id} className="border rounded-lg p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            {reward.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{reward.name}</h3>
                                            <p className="text-muted-foreground text-sm">{reward.description}</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 text-amber-500 mr-1" />
                                                    <span className="font-bold">{reward.cost}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRedeemReward(reward)}
                                                    className={`px-3 py-1 rounded text-sm font-medium ${userPoints >= reward.cost
                                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                            : "bg-muted text-muted-foreground cursor-not-allowed"
                                                        }`}
                                                >
                                                    Redeem
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "leaderboard" && (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/30 px-4 py-3 font-medium text-sm grid grid-cols-12">
                                <div className="col-span-1">#</div>
                                <div className="col-span-7">Traveler</div>
                                <div className="col-span-4 text-right">Points</div>
                            </div>
                            <div className="divide-y">
                                {leaderboardData.map((user, index) => (
                                    <div
                                        key={user.id}
                                        className={`px-4 py-3 grid grid-cols-12 items-center ${user.isCurrentUser ? "bg-primary/5 font-medium" : ""
                                            }`}
                                    >
                                        <div className="col-span-1 font-medium">
                                            {index + 1}
                                            {index < 3 && (
                                                <Crown className={`h-4 w-4 inline ml-1 ${index === 0 ? "text-yellow-500" :
                                                        index === 1 ? "text-gray-400" : "text-amber-700"
                                                    }`} />
                                            )}
                                        </div>
                                        <div className="col-span-7 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <span>{user.name}</span>
                                        </div>
                                        <div className="col-span-4 text-right font-bold">{user.points.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Game promotion section */}
                <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-200/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Play Travel Games, Earn Points!</h2>
                            <p className="text-muted-foreground">
                                Challenge yourself with our travel-themed games and earn points to unlock exclusive rewards.
                            </p>
                            <div className="mt-4 flex gap-4">
                                <Link
                                    href="/game"
                                    className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90"
                                >
                                    Memory Match
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                                <Link
                                    href="/game/travel-quiz"
                                    className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700"
                                >
                                    Travel Quiz
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-32 w-32 md:h-40 md:w-40">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Trophy className="h-16 w-16 text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>
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