// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import { Heart, Star, Sun, Moon, Cloud, Flower2, LucideIcon } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

// type MemoryCard = {
//     id: number;
//     icon: LucideIcon;
//     isMatched: boolean;
//     color: string;
// };

// const createCards = () => {
//     const iconConfigs = [
//         { icon: Heart, color: "text-rose-400" },
//         { icon: Star, color: "text-amber-400" },
//         { icon: Sun, color: "text-yellow-400" },
//         { icon: Moon, color: "text-purple-400" },
//         { icon: Cloud, color: "text-sky-400" },
//         { icon: Flower2, color: "text-emerald-400" },
//     ];

//     const cards: MemoryCard[] = [];

//     iconConfigs.forEach(({ icon, color }, index) => {
//         cards.push(
//             { id: index * 2, icon, color, isMatched: false },
//             { id: index * 2 + 1, icon, color, isMatched: false }
//         );
//     });

//     return cards.sort(() => Math.random() - 0.5);
// };

// export default function MemoryGame() {
//     const [cards, setCards] = useState<MemoryCard[]>(createCards());
//     const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
//     const [matches, setMatches] = useState(0);
//     const [isChecking, setIsChecking] = useState(false);
//     const toast = useToast();

//     const handleCardClick = (clickedIndex: number) => {
//         if (isChecking || cards[clickedIndex].isMatched) return;
//         if (flippedIndexes.includes(clickedIndex)) return;
//         if (flippedIndexes.length === 2) return;

//         const newFlipped = [...flippedIndexes, clickedIndex];
//         setFlippedIndexes(newFlipped);

//         if (newFlipped.length === 2) {
//             setIsChecking(true);
//             const [firstIndex, secondIndex] = newFlipped;
//             const firstCard = cards[firstIndex];
//             const secondCard = cards[secondIndex];

//             if (firstCard.icon === secondCard.icon) {
//                 setTimeout(() => {
//                     setCards((prevCards) =>
//                         prevCards.map((card, index) =>
//                             index === firstIndex || index === secondIndex
//                                 ? { ...card, isMatched: true }
//                                 : card
//                         )
//                     );
//                     setFlippedIndexes([]);
//                     setMatches((prevMatches) => prevMatches + 1);
//                     setIsChecking(false);
//                     if (matches + 1 === cards.length / 2) {
//                         toast.success({
//                             title: "🎉 Congratulations!",
//                             description: "You've found all the matches! 🎈",
//                             variant: "success",
//                         });
//                     }
//                 }, 500);
//             } else {
//                 setTimeout(() => {
//                     setFlippedIndexes([]);
//                     setIsChecking(false);
//                 }, 1000);
//             }
//         }
//     };

//     const resetGame = () => {
//         setCards(createCards());
//         setFlippedIndexes([]);
//         setMatches(0);
//         setIsChecking(false);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
//             <div className="text-center space-y-4">
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 text-transparent bg-clip-text">
//                     Memory Match Game
//                 </h1>
//                 <p className="text-indigo-200">
//                     Matches found: {matches} of {cards.length / 2}
//                 </p>
//             </div>

//             <div className="grid grid-cols-3 gap-4 md:gap-6 p-6 rounded-xl bg-indigo-950/50 backdrop-blur-sm">
//                 {cards.map((card, index) => (
//                     <motion.div
//                         key={card.id}
//                         initial={{ rotateY: 0 }}
//                         animate={{
//                             rotateY: card.isMatched || flippedIndexes.includes(index) ? 180 : 0,
//                         }}
//                         transition={{ duration: 0.3 }}
//                         className="perspective-1000"
//                     >
//                         <motion.div
//                             className={`relative w-24 h-24 md:w-32 md:h-32 cursor-pointer transform-style-3d transition-all duration-300 ${card.isMatched
//                                 ? "bg-indigo-900/50 border-indigo-400/50"
//                                 : flippedIndexes.includes(index)
//                                     ? "bg-indigo-800/50 border-indigo-500/50"
//                                     : "bg-indigo-950 border-indigo-800 hover:border-indigo-600 hover:bg-indigo-900/80"
//                                 }`}
//                             onClick={() => handleCardClick(index)}
//                         >
//                             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/5" />
//                             <AnimatePresence>
//                                 {(card.isMatched || flippedIndexes.includes(index)) && (
//                                     <motion.div
//                                         initial={{ opacity: 0, rotateY: 180 }}
//                                         animate={{ opacity: 1, rotateY: 180 }}
//                                         exit={{ opacity: 0, rotateY: 180 }}
//                                         className="absolute inset-0 flex items-center justify-center backface-hidden"
//                                     >
//                                         <card.icon
//                                             className={`w-12 h-12 ${card.isMatched
//                                                 ? `${card.color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`
//                                                 : card.color
//                                                 }`}
//                                         />
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//                         </motion.div>
//                     </motion.div>
//                 ))}
//             </div>

//             <Button
//                 onClick={resetGame}
//                 variant="outline"
//                 size="lg"
//                 className="bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
//             >
//                 Start New Game
//             </Button>
//         </div>
//     );
// }