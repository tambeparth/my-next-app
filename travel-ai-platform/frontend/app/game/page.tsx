"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
    Plane,
    Palmtree,
    Compass,
    Globe,
    Mountain,
    Umbrella,
    Map,
    Camera,
    Luggage,
    Sunset,
    Ship,
    Train,
    Clock,
    LucideIcon
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/app/Context/UserContext";
import useSound from "use-sound"; // For sound effects
import Link from "next/link";

type MemoryCard = {
    id: number;
    icon: LucideIcon;
    isMatched: boolean;
    color: string;
    name: string;
};

const createCards = () => {
    const iconConfigs = [
        { icon: Plane, color: "text-sky-400", name: "Airplane" },
        { icon: Palmtree, color: "text-emerald-400", name: "Beach" },
        { icon: Compass, color: "text-amber-400", name: "Compass" },
        { icon: Globe, color: "text-blue-400", name: "World" },
        { icon: Mountain, color: "text-stone-400", name: "Mountain" },
        { icon: Umbrella, color: "text-rose-400", name: "Umbrella" },
        { icon: Map, color: "text-yellow-400", name: "Map" },
        { icon: Camera, color: "text-purple-400", name: "Camera" },
        { icon: Luggage, color: "text-orange-400", name: "Luggage" },
        { icon: Sunset, color: "text-red-400", name: "Sunset" },
        { icon: Ship, color: "text-indigo-400", name: "Cruise" },
        { icon: Train, color: "text-green-400", name: "Train" },
    ];

    // Select 6 random icons for the game
    const selectedIcons = iconConfigs
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

    const cards: MemoryCard[] = [];

    selectedIcons.forEach(({ icon, color, name }, index) => {
        cards.push(
            { id: index * 2, icon, color, isMatched: false, name },
            { id: index * 2 + 1, icon, color, isMatched: false, name }
        );
    });

    return cards.sort(() => Math.random() - 0.5);
};

export default function MemoryGame() {
    const [cards, setCards] = useState<MemoryCard[]>(createCards());
    const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [moves, setMoves] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameTime, setGameTime] = useState(0);
    const { addUserPoints } = useUser();
    const [playCelebrationSound] = useSound("/sounds/celebration.mp3"); // Add a sound file in the public folder
    const [playFlipSound] = useSound("/sounds/card-flip.mp3", { volume: 0.5 });
    const [playMatchSound] = useSound("/sounds/match.mp3", { volume: 0.5 });

    // Timer for the game
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (gameStarted && !isGameComplete) {
            interval = setInterval(() => {
                setGameTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameStarted, isGameComplete]);

    const handleCardClick = (clickedIndex: number) => {
        if (isChecking || cards[clickedIndex].isMatched || flippedIndexes.includes(clickedIndex)) return;

        if (!gameStarted) {
            setGameStarted(true);
        }

        playFlipSound();

        const newFlipped = [...flippedIndexes, clickedIndex];
        setFlippedIndexes(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            setIsChecking(true);
            const [firstIndex, secondIndex] = newFlipped;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.icon === secondCard.icon) {
                playMatchSound();
                setTimeout(() => {
                    setCards((prevCards) =>
                        prevCards.map((card, index) =>
                            index === firstIndex || index === secondIndex
                                ? { ...card, isMatched: true }
                                : card
                        )
                    );
                    setFlippedIndexes([]);
                    setMatches((m) => m + 1);
                    setIsChecking(false);

                    // Calculate points based on game progress
                    const basePoints = 10;
                    const bonusPoints = Math.max(0, 20 - moves); // Bonus for fewer moves
                    const totalPoints = basePoints + bonusPoints;

                    addUserPoints(totalPoints);

                    toast.success(`Match found! +${totalPoints} points`, {
                        duration: 1500,
                    });

                    if (matches === cards.length / 2 - 1) {
                        // Calculate final bonus based on time and moves
                        const timeBonus = Math.max(0, 300 - gameTime) / 2;
                        const movesBonus = Math.max(0, 100 - (moves * 5));
                        const completionBonus = 50;
                        const finalBonus = Math.round(timeBonus + movesBonus + completionBonus);

                        setIsGameComplete(true);
                        playCelebrationSound(); // Play celebration sound

                        // Add completion bonus
                        addUserPoints(finalBonus);

                        toast.success(`🎉 Game Complete! Bonus: +${finalBonus} points! 🎈`, {
                            duration: 3000,
                            className: "bg-purple-900 text-purple-100 border-purple-700",
                        });
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    setFlippedIndexes([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    const resetGame = () => {
        setCards(createCards());
        setFlippedIndexes([]);
        setMatches(0);
        setMoves(0);
        setGameTime(0);
        setIsChecking(false);
        setIsGameComplete(false);
        setGameStarted(false);
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

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Game completion screen
    if (isGameComplete) {
        const timeBonus = Math.max(0, 300 - gameTime) / 2;
        const movesBonus = Math.max(0, 100 - (moves * 5));
        const completionBonus = 50;
        const finalBonus = Math.round(timeBonus + movesBonus + completionBonus);
        const basePoints = matches * 10;
        const totalPoints = basePoints + finalBonus;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950">
                <Confetti />

                <div className="max-w-md w-full bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-sm border border-blue-700/30 rounded-xl p-8 text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-blue-400" />

                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text mb-6">
                        Travel Memory Master!
                    </h1>

                    <div className="space-y-4 mb-6">
                        <div className="bg-blue-900/30 p-3 rounded-lg">
                            <p className="text-blue-200 text-sm">Game Stats</p>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="text-blue-300 text-xs">Time</p>
                                    <p className="text-white font-bold">{formatTime(gameTime)}</p>
                                </div>
                                <div>
                                    <p className="text-blue-300 text-xs">Moves</p>
                                    <p className="text-white font-bold">{moves}</p>
                                </div>
                                <div>
                                    <p className="text-blue-300 text-xs">Matches</p>
                                    <p className="text-white font-bold">{matches}</p>
                                </div>
                                <div>
                                    <p className="text-blue-300 text-xs">Base Points</p>
                                    <p className="text-white font-bold">{basePoints}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-900/30 p-3 rounded-lg">
                            <p className="text-indigo-200 text-sm">Bonus Points</p>
                            <p className="text-yellow-400 text-3xl font-bold">+{finalBonus}</p>
                            <p className="text-indigo-300 text-xs mt-1">For quick completion and efficient matching</p>
                        </div>

                        <div className="bg-purple-900/30 p-3 rounded-lg">
                            <p className="text-purple-200 text-sm">Total Points Earned</p>
                            <p className="text-yellow-400 text-3xl font-bold">{totalPoints}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={resetGame}
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
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950">
            <header className="w-full max-w-4xl flex justify-between items-center">
                <Link href="/gamification" className="text-blue-300 hover:text-blue-200 flex items-center gap-2">
                    <motion.div
                        initial={{ x: 10 }}
                        animate={{ x: 0 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
                    >
                        <Globe className="h-5 w-5" />
                    </motion.div>
                    Back to Rewards
                </Link>
                <Link href="/game/travel-quiz" className="text-blue-300 hover:text-blue-200 flex items-center gap-2">
                    Try Travel Quiz
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: 5 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
                    >
                        <Compass className="h-5 w-5" />
                    </motion.div>
                </Link>
            </header>

            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
                    Travel Memory Match
                </h1>
                <p className="text-blue-200">
                    Match the travel icons to earn points!
                </p>
            </div>

            <div className="flex justify-center gap-6 text-sm">
                <div className="bg-blue-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Map className="h-4 w-4 text-blue-400" />
                    <span>{matches}/{cards.length / 2} Matches</span>
                </div>
                <div className="bg-indigo-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Compass className="h-4 w-4 text-indigo-400" />
                    <span>{moves} Moves</span>
                </div>
                <div className="bg-purple-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span>{formatTime(gameTime)}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border border-blue-800/30">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ rotateY: 0 }}
                        animate={{
                            rotateY: card.isMatched || flippedIndexes.includes(index) ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="perspective-1000"
                    >
                        <Card
                            className={`relative w-20 h-20 md:w-24 md:h-24 cursor-pointer transform-style-3d transition-all duration-300 ${card.isMatched
                                ? "bg-blue-900/50 border-blue-400/50"
                                : flippedIndexes.includes(index)
                                    ? "bg-indigo-800/50 border-indigo-500/50"
                                    : "bg-indigo-950 border-indigo-800 hover:border-indigo-600 hover:bg-indigo-900/80"
                                }`}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-white/5" />

                            {/* Card back */}
                            {!card.isMatched && !flippedIndexes.includes(index) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Globe className="w-8 h-8 text-blue-500/30" />
                                </div>
                            )}

                            {/* Card front */}
                            <AnimatePresence>
                                {(card.isMatched || flippedIndexes.includes(index)) && (
                                    <motion.div
                                        initial={{ opacity: 0, rotateY: 180 }}
                                        animate={{ opacity: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, rotateY: 180 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center"
                                    >
                                        <card.icon
                                            className={`w-10 h-10 ${card.isMatched
                                                ? `${card.color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`
                                                : card.color
                                                }`}
                                        />
                                        <span className="text-xs mt-1 text-white/80">{card.name}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={resetGame}
                    variant="outline"
                    size="lg"
                    className="bg-blue-900/50 border-blue-700 hover:bg-blue-800 hover:border-blue-500 text-blue-200 hover:text-blue-100"
                >
                    New Game
                </Button>
                <Link href="/game/travel-quiz" passHref>
                    <Button
                        variant="outline"
                        size="lg"
                        className="bg-indigo-900/50 border-indigo-700 hover:bg-indigo-800 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
                    >
                        Try Travel Quiz
                    </Button>
                </Link>
            </div>
        </div>
    );
}