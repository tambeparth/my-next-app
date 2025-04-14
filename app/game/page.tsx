"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heart, Star, Sun, Moon, Cloud, Flower2, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/app/Context/UserContext";
import useSound from "use-sound"; // For sound effects

type MemoryCard = {
    id: number;
    icon: LucideIcon;
    isMatched: boolean;
    color: string;
};

const createCards = () => {
    const iconConfigs = [
        { icon: Heart, color: "text-rose-400" },
        { icon: Star, color: "text-amber-400" },
        { icon: Sun, color: "text-yellow-400" },
        { icon: Moon, color: "text-purple-400" },
        { icon: Cloud, color: "text-sky-400" },
        { icon: Flower2, color: "text-emerald-400" },
    ];

    const cards: MemoryCard[] = [];

    iconConfigs.forEach(({ icon, color }, index) => {
        cards.push(
            { id: index * 2, icon, color, isMatched: false },
            { id: index * 2 + 1, icon, color, isMatched: false }
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
    const { addUserPoints } = useUser();
    const [playCelebrationSound] = useSound("/sounds/celebration.mp3"); // Add a sound file in the public folder

    const handleCardClick = (clickedIndex: number) => {
        if (isChecking || cards[clickedIndex].isMatched || flippedIndexes.includes(clickedIndex)) return;

        const newFlipped = [...flippedIndexes, clickedIndex];
        setFlippedIndexes(newFlipped);

        if (newFlipped.length === 2) {
            setIsChecking(true);
            const [firstIndex, secondIndex] = newFlipped;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.icon === secondCard.icon) {
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

                    addUserPoints(10);

                    if (matches === cards.length / 2 - 1) {
                        setIsGameComplete(true);
                        playCelebrationSound(); // Play celebration sound
                        toast("🎉 Congratulations! You've found all the matches! 🎈", {
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
        setIsChecking(false);
        setIsGameComplete(false);
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
            {isGameComplete && <Confetti />} {/* Show confetti when game is complete */}

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 text-transparent bg-clip-text">
                    Memory Match Game
                </h1>
                <p className="text-indigo-200">
                    Matches found: {matches} of {cards.length / 2}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-6 p-6 rounded-xl bg-indigo-950/50 backdrop-blur-sm">
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
                            className={`relative w-24 h-24 md:w-32 md:h-32 cursor-pointer transform-style-3d transition-all duration-300 ${card.isMatched
                                ? "bg-indigo-900/50 border-indigo-400/50"
                                : flippedIndexes.includes(index)
                                    ? "bg-indigo-800/50 border-indigo-500/50"
                                    : "bg-indigo-950 border-indigo-800 hover:border-indigo-600 hover:bg-indigo-900/80"
                                }`}
                            onClick={() => handleCardClick(index)}
                            isFlipped={flippedIndexes.includes(index)}
                            isMatched={card.isMatched}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/5" />
                            <AnimatePresence>
                                {(card.isMatched || flippedIndexes.includes(index)) && (
                                    <motion.div
                                        initial={{ opacity: 0, rotateY: 180 }}
                                        animate={{ opacity: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, rotateY: 180 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <card.icon
                                            className={`w-12 h-12 ${card.isMatched
                                                ? `${card.color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`
                                                : card.color
                                                }`}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Button
                onClick={resetGame}
                variant="outline"
                size="lg"
                className="bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
            >
                Start New Game
            </Button>
        </div>
    );
}