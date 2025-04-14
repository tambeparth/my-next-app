// Game data including destinations and questions

export const destinations = [
    {
        id: 1,
        name: "Paris",
        mapX: 200,
        mapY: 150,
        description: "The City of Light",
        questions: [
            {
                text: "What is the name of the famous tower in Paris?",
                options: ["Eiffel Tower", "Big Ben", "Leaning Tower", "CN Tower"],
                correctAnswer: 0,
            },
            {
                text: "Which river runs through Paris?",
                options: ["Thames", "Seine", "Rhine", "Danube"],
                correctAnswer: 1,
            },
            {
                text: "What is the famous art museum in Paris?",
                options: ["Prado", "MoMA", "Louvre", "Tate Modern"],
                correctAnswer: 2,
            },
        ],
    },
    {
        id: 2,
        name: "Tokyo",
        mapX: 650,
        mapY: 180,
        description: "The bustling capital of Japan",
        questions: [
            {
                text: "What is the tallest structure in Tokyo?",
                options: ["Tokyo Tower", "Tokyo Skytree", "Roppongi Hills", "Tokyo Metropolitan Government Building"],
                correctAnswer: 1,
            },
            {
                text: "Which of these is a famous district in Tokyo?",
                options: ["Gangnam", "Shibuya", "Kowloon", "Pudong"],
                correctAnswer: 1,
            },
            {
                text: "What is Japan's traditional form of theater?",
                options: ["Peking Opera", "Kabuki", "Ballet", "Pantomime"],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 3,
        name: "New York",
        mapX: 150,
        mapY: 170,
        description: "The Big Apple",
        questions: [
            {
                text: "Which borough is home to Central Park?",
                options: ["Brooklyn", "Queens", "Manhattan", "The Bronx"],
                correctAnswer: 2,
            },
            {
                text: "What is the name of the famous statue in New York Harbor?",
                options: ["Statue of Freedom", "Statue of Democracy", "Statue of Liberty", "Statue of Independence"],
                correctAnswer: 2,
            },
            {
                text: "How many streets make up Times Square?",
                options: ["2", "4", "6", "8"],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 4,
        name: "Cairo",
        mapX: 350,
        mapY: 220,
        description: "Home of the Pyramids",
        questions: [
            {
                text: "Which famous river flows through Cairo?",
                options: ["Tigris", "Euphrates", "Nile", "Amazon"],
                correctAnswer: 2,
            },
            {
                text: "What ancient wonder is located near Cairo?",
                options: ["Hanging Gardens", "Great Pyramids", "Colossus of Rhodes", "Lighthouse of Alexandria"],
                correctAnswer: 1,
            },
            {
                text: "What is the name of the famous market in Cairo?",
                options: ["Grand Bazaar", "Khan el-Khalili", "Marrakech Souk", "Chatuchak"],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 5,
        name: "Sydney",
        mapX: 650,
        mapY: 350,
        description: "The Harbour City",
        questions: [
            {
                text: "What is the name of Sydney's famous opera house?",
                options: ["Royal Opera House", "Sydney Opera House", "Metropolitan Opera", "La Scala"],
                correctAnswer: 1,
            },
            {
                text: "Which famous beach is located in Sydney?",
                options: ["Bondi Beach", "Copacabana", "Waikiki", "Venice Beach"],
                correctAnswer: 0,
            },
            {
                text: "What is the name of the harbor bridge in Sydney?",
                options: ["Golden Gate Bridge", "Brooklyn Bridge", "Sydney Harbour Bridge", "Tower Bridge"],
                correctAnswer: 2,
            },
        ],
    },
]

