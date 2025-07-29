// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/Button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { CheckCircle, XCircle } from "lucide-react";

// interface TravelQuizProps {
//     destination: {
//         name: string;
//         questions: {
//             text: string;
//             options: string[];
//             correctAnswer: number;
//         }[];
//     };
//     onComplete: (score: number) => void;
// }

// export default function TravelQuiz({ destination, onComplete }: TravelQuizProps) {
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [score, setScore] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
//     const [showResult, setShowResult] = useState(false);
//     const [quizComplete, setQuizComplete] = useState(false);

//     const handleAnswerSelect = (index: number) => {
//         if (showResult) return;

//         setSelectedAnswer(index);
//         setShowResult(true);

//         const isCorrect = index === destination.questions[currentQuestion].correctAnswer;
//         if (isCorrect) {
//             setScore(score + 10);
//         }

//         setTimeout(() => {
//             if (currentQuestion < destination.questions.length - 1) {
//                 setCurrentQuestion(currentQuestion + 1);
//                 setSelectedAnswer(null);
//                 setShowResult(false);
//             } else {
//                 setQuizComplete(true);
//             }
//         }, 1500);
//     };

//     const handleComplete = () => {
//         onComplete(score);
//     };

//     if (!destination || !destination.questions) {
//         return <div>Loading quiz...</div>;
//     }

//     const question = destination.questions[currentQuestion];

//     return (
//         <div className="p-2">
//             <div className="p-4">
//                 <h1 className="text-xl text-center">{destination.name} Quiz</h1>
//             </div>
//             <div>
//                 {!quizComplete ? (
//                     <>
//                         <div className="mb-4 text-center">
//                             <span className="text-sm text-muted-foreground">
//                                 Question {currentQuestion + 1} of {destination.questions.length}
//                             </span>
//                             <h3 className="text-lg font-medium mt-2">{question.text}</h3>
//                         </div>
//                         <div className="space-y-3">
//                             {question.options.map((option, index) => (
//                                 <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                                     <Button
//                                         variant={
//                                             selectedAnswer === index
//                                                 ? index === question.correctAnswer
//                                                     ? "success"
//                                                     : "destructive"
//                                                 : "outline"
//                                         }
//                                         className={`w-full justify-start text-left p-4 h-auto ${showResult && index === question.correctAnswer ? "bg-green-100 border-green-500" : ""
//                                             }`}
//                                         onClick={() => handleAnswerSelect(index)}
//                                         disabled={showResult}
//                                     >
//                                         <div className="flex items-center w-full">
//                                             <span className="flex-grow">{option}</span>
//                                             {showResult && index === question.correctAnswer && (
//                                                 <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
//                                             )}
//                                             {showResult && selectedAnswer === index && index !== question.correctAnswer && (
//                                                 <XCircle className="h-5 w-5 text-red-600 ml-2" />
//                                             )}
//                                         </div>
//                                     </Button>
//                                 </motion.div>
//                             ))}
//                         </div>
//                         {showResult && (
//                             <div className="mt-4 text-center">
//                                 {selectedAnswer === question.correctAnswer ? (
//                                     <p className="text-green-600 font-medium">Correct! +10 points</p>
//                                 ) : (
//                                     <p className="text-red-600 font-medium">
//                                         Incorrect! The correct answer is: {question.options[question.correctAnswer]}
//                                     </p>
//                                 )}
//                             </div>
//                         )}
//                     </>
//                 ) : (
//                     <div className="text-center">
//                         <h3 className="text-xl font-bold mb-4">Quiz Complete!</h3>
//                         <p className="text-lg mb-6">
//                             You scored <span className="font-bold text-primary">{score}</span> points
//                         </p>
//                         <Button onClick={handleComplete}>Continue Adventure</Button>
//                     </div>
//                 )}
//             </CardContent>
//         </div>
//     );
// }