// Game data storage utility functions

// Save game data to localStorage
export function saveGameData(data: GameData): void {
    try {
        // Get existing data
        const existingDataStr = localStorage.getItem("smartTravelGameData")
        let allData: GameData[] = []

        if (existingDataStr) {
            allData = JSON.parse(existingDataStr)

            // Update existing player data or add new entry
            const existingIndex = allData.findIndex((item) => item.playerName === data.playerName)
            if (existingIndex >= 0) {
                allData[existingIndex] = data
            } else {
                allData.push(data)
            }
        } else {
            allData = [data]
        }

        // Save back to localStorage
        localStorage.setItem("smartTravelGameData", JSON.stringify(allData))

        // Also save current player separately for easy retrieval
        localStorage.setItem("currentPlayer", JSON.stringify(data))
    } catch (error) {
        console.error("Error saving game data:", error)
    }
}

// Load current player's game data
export function loadGameData(): GameData | null {
    try {
        const dataStr = localStorage.getItem("currentPlayer")
        if (dataStr) {
            return JSON.parse(dataStr)
        }
        return null
    } catch (error) {
        console.error("Error loading game data:", error)
        return null
    }
}

// Load all players' game data
export function loadAllGameData(): GameData[] {
    try {
        const dataStr = localStorage.getItem("smartTravelGameData")
        if (dataStr) {
            return JSON.parse(dataStr)
        }
        return []
    } catch (error) {
        console.error("Error loading all game data:", error)
        return []
    }
}

// Clear all game data
export function clearGameData(): void {
    try {
        localStorage.removeItem("smartTravelGameData")
        localStorage.removeItem("currentPlayer")
    } catch (error) {
        console.error("Error clearing game data:", error)
    }
}

// Types
export interface GameData {
    playerName: string
    score: number
    currentDestination: number
    timestamp: string
}

