// "use client";

// import { useEffect, useState } from "react";
// import Card from "@/components/ui/Card";
// import CardContent from "@/components/ui/Card";
// import CardHeader from "@/components/ui/Card";
// import CardTitle from "@/components/ui/Card";
// import { Trophy } from "lucide-react";
// import { loadAllGameData } from "@/lib/game-storage";
// interface LeaderboardEntry {
//     playerName: string;
//     score: number;
//     timestamp: string;
// }

// export default function Leaderboard() {
//     const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

//     useEffect(() => {
//         const data = loadAllGameData();
//         const sortedData = data.sort((a, b) => b.score - a.score).slice(0, 10);
//         setLeaderboardData(sortedData);
//     }, []);
//     return (
//         <Card title="" description="" imageUrl="">
//             <CardHeader title="" description="" imageUrl="">
//                 <CardTitle className="text-xl flex items-center justify-center" title="" description="" imageUrl="">
//                     <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
//                     Leaderboard
//                 </CardTitle>
//             </CardHeader>
//             <CardContent title={""} description={""} imageUrl={""}>
//                 {leaderboardData.length > 0 ? (
//                     <div className="divide-y">
//                         {leaderboardData.map((entry, index) => (
//                             <div key={index} className="py-2 flex justify-between items-center">
//                                 <div className="flex items-center">
//                                     <span
//                                         className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${index === 0
//                                             ? "bg-yellow-100 text-yellow-700"
//                                             : index === 1
//                                                 ? "bg-gray-100 text-gray-700"
//                                                 : index === 2
//                                                     ? "bg-amber-100 text-amber-700"
//                                                     : "bg-blue-50 text-blue-700"
//                                             }`}
//                                     >
//                                         {index + 1}
//                                     </span>
//                                     <span className="font-medium">{entry.playerName}</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <span className="font-bold text-primary">{entry.score}</span>
//                                     <span className="text-xs text-muted-foreground ml-2">
//                                         {new Date(entry.timestamp).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-center py-4 text-muted-foreground">No scores yet. Be the first!</p>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }