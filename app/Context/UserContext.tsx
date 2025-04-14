// app/context/UserContext.tsx
"use client"

import React, { createContext, useContext, useState } from "react"

type UserContextType = {
    userPoints: number
    addUserPoints: (points: number) => void // Function to add points
    badges: string[]
    setBadges: (badges: string[]) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userPoints, setUserPoints] = useState(1250) // Initial points
    const [badges, setBadges] = useState<string[]>([]) // Initial badges

    // Function to add points to the user's current points
    const addUserPoints = (points: number) => {
        setUserPoints((prevPoints) => prevPoints + points)
    }

    return (
        <UserContext.Provider value={{ userPoints, addUserPoints, badges, setBadges }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}