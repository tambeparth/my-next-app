interface Attraction {
    name: string;
    type: string;
    duration: string;
    description: string;
    rating: number;
    price: string;
    bestTime: string;
    tips: string;
}

interface Destination {
    attractions: Attraction[];
}

export const destinationsData: Record<string, Destination> = {
    paris: {
        attractions: [
            {
                name: "Eiffel Tower",
                description: "Iconic iron lattice tower on the Champ de Mars",
                duration: "2-3 hours",
                price: "€26.10",
                type: "Landmark",
                rating: 4.7,
                bestTime: "Evening",
                tips: "Buy tickets online to skip the line"
            },
            {
                name: "Louvre Museum",
                description: "World's largest art museum and historic monument",
                duration: "3-4 hours",
                price: "€17",
                type: "Museum",
                rating: 4.8,
                bestTime: "Morning",
                tips: "Visit on Wednesday or Friday evenings for fewer crowds"
            }
        ]
    },
    london: {
        attractions: [
            {
                name: "Big Ben",
                description: "Iconic clock tower at the north end of the Palace of Westminster",
                duration: "1 hour",
                price: "Free",
                type: "Landmark",
                rating: 4.6,
                bestTime: "Daytime",
                tips: "Best viewed from Westminster Bridge"
            },
            {
                name: "Tower of London",
                description: "Historic castle and fortress on the north bank of the River Thames",
                duration: "3-4 hours",
                price: "£29.90",
                type: "Historical",
                rating: 4.7,
                bestTime: "Morning",
                tips: "Book tickets in advance and start with the Crown Jewels"
            }
        ]
    }
    // Add more destinations as needed
};
