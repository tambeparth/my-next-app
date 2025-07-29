"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Check, Globe, MapPin, X, Award, Compass, Plane, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/app/Context/UserContext";
import Link from "next/link";
import useSound from "use-sound"; // For sound effects

// Define the quiz question type
type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    image?: string;
    difficulty: "easy" | "medium" | "hard";
    points: number;
    category: "landmarks" | "geography" | "culture" | "travel";
};

// Travel-themed quiz questions
const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "Which city is known as the 'City of Light'?",
        options: ["London", "Paris", "New York", "Tokyo"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10,
        category: "geography"
    },
    {
        id: 2,
        question: "What is the tallest mountain in the world?",
        options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Matterhorn"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10,
        category: "geography"
    },
    {
        id: 3,
        question: "Which of these is NOT one of the Seven Wonders of the Modern World?",
        options: ["Taj Mahal", "Eiffel Tower", "Great Wall of China", "Machu Picchu"],
        correctAnswer: 1,
        difficulty: "medium",
        points: 20,
        category: "landmarks"
    },
    {
        id: 4,
        question: "Which country is famous for the Carnival in Rio de Janeiro?",
        options: ["Spain", "Italy", "Brazil", "Mexico"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10,
        category: "culture"
    },
    {
        id: 5,
        question: "What is the currency of Japan?",
        options: ["Yuan", "Won", "Yen", "Ringgit"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10,
        category: "travel"
    },
    {
        id: 6,
        question: "Which ocean is the largest?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        difficulty: "easy",
        points: 10,
        category: "geography"
    },
    {
        id: 7,
        question: "The ancient city of Petra is located in which country?",
        options: ["Egypt", "Jordan", "Turkey", "Greece"],
        correctAnswer: 1,
        difficulty: "medium",
        points: 20,
        category: "landmarks"
    },
    {
        id: 8,
        question: "Which of these cities is NOT in Italy?",
        options: ["Florence", "Naples", "Barcelona", "Venice"],
        correctAnswer: 2,
        difficulty: "medium",
        points: 20,
        category: "geography"
    },
    {
        id: 9,
        question: "What is the traditional Japanese art of paper folding called?",
        options: ["Ikebana", "Origami", "Bonsai", "Kabuki"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10,
        category: "culture"
    },
    {
        id: 10,
        question: "Which airline is the flag carrier of Australia?",
        options: ["Air Australia", "Qantas", "Jetstar", "Virgin Australia"],
        correctAnswer: 1,
        difficulty: "medium",
        points: 20,
        category: "travel"
    },
    {
        id: 11,
        question: "The Great Barrier Reef is located off the coast of which country?",
        options: ["New Zealand", "Indonesia", "Australia", "Philippines"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10,
        category: "geography"
    },
    {
        id: 12,
        question: "Which famous landmark is located in Agra, India?",
        options: ["Taj Mahal", "Colosseum", "Angkor Wat", "Petra"],
        correctAnswer: 0,
        difficulty: "easy",
        points: 10,
        category: "landmarks"
    },
    {
        id: 13,
        question: "What is the capital city of Canada?",
        options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
        correctAnswer: 3,
        difficulty: "medium",
        points: 20,
        category: "geography"
    },
    {
        id: 14,
        question: "Which of these is NOT a type of accommodation?",
        options: ["Hostel", "Resort", "Pavilion", "Motel"],
        correctAnswer: 2,
        difficulty: "medium",
        points: 20,
        category: "travel"
    },
    {
        id: 15,
        question: "The Louvre Museum is located in which city?",
        options: ["Rome", "Paris", "London", "Madrid"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10,
        category: "landmarks"
    }
];

export default function TravelQuizGame() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
    const [timeLeft, setTimeLeft] = useState(5); // 5 seconds per question
    const [isTimerActive, setIsTimerActive] = useState(true);
    const { addUserPoints } = useUser();
    
    // Sound effects
    const [playCorrect] = useSound("/sounds/correct.mp3", { volume: 0.5 });
    const [playWrong] = useSound("/sounds/wrong.mp3", { volume: 0.5 });
    const [playComplete] = useSound("/sounds/celebration.mp3", { volume: 0.5 });

    // Shuffle questions on component mount
    useEffect(() => {
        const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
        setShuffledQuestions(shuffled);
    }, []);

    // Timer effect with auto-answer after 5 seconds
    useEffect(() => {
        if (!isTimerActive || gameOver || isAnswered) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-answer with a random option if time runs out
                    if (!isAnswered) {
                        toast.error("Time's up!", {
                            duration: 1500,
                        });
                        
                        // Auto-select a random wrong answer
                        const currentQ = shuffledQuestions[currentQuestionIndex];
                        let randomOption;
                        do {
                            randomOption = Math.floor(Math.random() * currentQ.options.length);
                        } while (randomOption === currentQ.correctAnswer);
                        
                        // Call handleAnswer with the random option
                        handleAnswer(randomOption);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerActive, gameOver, isAnswered, currentQuestionIndex, shuffledQuestions]);

    const handleAnswer = (optionIndex: number) => {
        console.log("Answer clicked:", optionIndex);
        
        // Don't process if game is over
        if (gameOver) return;

        // If already answered, just move to next question immediately
        if (isAnswered) {
            if (currentQuestionIndex < shuffledQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
                setIsAnswered(false);
                setTimeLeft(5);
                setIsTimerActive(true);
            } else {
                setGameOver(true);
                playComplete();
                addUserPoints(totalPoints);
            }
            return;
        }
        
        // Process new answer
        setIsAnswered(true);
        setSelectedOption(optionIndex);
        setIsTimerActive(false);

        const currentQuestion = shuffledQuestions[currentQuestionIndex];

        // Only check answer if it's a valid option index (not -1 for timeout)
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
            // Check if answer is correct
            if (optionIndex === currentQuestion.correctAnswer) {
                playCorrect();
                setScore(score + 1);
                setTotalPoints(totalPoints + currentQuestion.points);
                toast.success(`Correct! +${currentQuestion.points} points`, {
                    duration: 1500,
                });
            } else {
                playWrong();
                toast.error("Incorrect answer", {
                    duration: 1500,
                });
            }
        }

        // Move to next question after a delay
        setTimeout(() => {
            if (currentQuestionIndex < shuffledQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
                setIsAnswered(false);
                setTimeLeft(5);
                setIsTimerActive(true);
            } else {
                // Game over
                setGameOver(true);
                playComplete();
                
                // Add points to user account
                addUserPoints(totalPoints);
                
                toast.success(`Quiz completed! You earned ${totalPoints} points!`, {
                    duration: 3000,
                });
            }
        }, 1500);
    };

    const restartGame = () => {
        const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
        setShuffledQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setTotalPoints(0);
        setGameOver(false);
        setTimeLeft(5);
        setIsTimerActive(true);
    };

    // Confetti/Balloon Burst Animation
    const Confetti = () => {
        return (
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0 }}
                        animate={{
                            y: window.innerHeight,
                            x: Math.random() * window.innerWidth,
                            rotate: 360,
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    />
                ))}
            </div>
        );
    };

    // Loading state
    if (shuffledQuestions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Game over screen
    if (gameOver) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white">
                <Confetti />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-6 rounded-xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-sm border border-blue-700/30 shadow-xl"
                >
                    <div className="text-center mb-6">
                        <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-2" />
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                            Quiz Complete!
                        </h1>
                        <p className="text-blue-200 mt-2">
                            You scored {score} out of {shuffledQuestions.length}
                        </p>
                        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
                            <p className="text-lg font-medium text-blue-100">Total Points Earned</p>
                            <p className="text-3xl font-bold text-yellow-400">{totalPoints}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button
                            onClick={restartGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Play Again
                        </Button>
                        <Link href="/gamification" passHref>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                View Rewards
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    return (
        <div className="flex min-h-screen flex-col p-4 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white">
            <header className="container mx-auto flex justify-between items-center py-4">
                <Link href="/game" className="text-blue-300 hover:text-blue-200 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Back to Games
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-900/50 px-3 py-1 rounded-full text-sm font-medium">
                        Question {currentQuestionIndex + 1}/{shuffledQuestions.length}
                    </div>
                    <div className="bg-indigo-900/50 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        {totalPoints} pts
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto flex flex-col items-center justify-center py-8">
                <div className="w-full max-w-2xl">
                    {/* Timer */}
                    <div className="mb-4 w-full bg-gray-800 rounded-full h-2.5">
                        <motion.div
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: "100%" }}
                            animate={{ width: `${(timeLeft / 5) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Question card */}
                    <Card className="p-6 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-sm border border-blue-700/30 shadow-xl">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-blue-300 text-sm font-medium mb-2">
                                {currentQuestion.category === "landmarks" && <MapPin className="h-4 w-4" />}
                                {currentQuestion.category === "geography" && <Globe className="h-4 w-4" />}
                                {currentQuestion.category === "culture" && <Award className="h-4 w-4" />}
                                {currentQuestion.category === "travel" && <Plane className="h-4 w-4" />}
                                <span className="capitalize">{currentQuestion.category}</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{currentQuestion.difficulty}</span>
                                <span className="mx-2">•</span>
                                <span>{currentQuestion.points} pts</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">{currentQuestion.question}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className={`p-4 rounded-lg text-left transition-all ${isAnswered
                                        ? index === currentQuestion.correctAnswer
                                            ? "bg-green-600/30 border border-green-500"
                                            : index === selectedOption
                                                ? "bg-red-600/30 border border-red-500"
                                                : "bg-blue-900/30 border border-blue-800/50"
                                        : "bg-blue-900/30 border border-blue-800/50 hover:bg-blue-800/40"
                                        }`}
                                    disabled={false}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${isAnswered
                                            ? index === currentQuestion.correctAnswer
                                                ? "bg-green-500 text-white"
                                                : index === selectedOption
                                                    ? "bg-red-500 text-white"
                                                    : "bg-blue-800 text-blue-200"
                                            : "bg-blue-800 text-blue-200"
                                            }`}>
                                            {isAnswered ? (
                                                index === currentQuestion.correctAnswer ? (
                                                    <Check className="h-4 w-4" />
                                                ) : index === selectedOption ? (
                                                    <X className="h-4 w-4" />
                                                ) : (
                                                    String.fromCharCode(65 + index)
                                                )
                                            ) : (
                                                String.fromCharCode(65 + index)
                                            )}
                                        </div>
                                        <span>{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </main>

            <footer className="container mx-auto py-4 text-center text-blue-300/70 text-sm">
                <p>Answer correctly to earn points and unlock travel rewards!</p>
            </footer>
        </div>
    );
}
