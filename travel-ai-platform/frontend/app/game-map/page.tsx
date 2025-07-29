// "use client";

// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { destinations } from "@/lib/game-data";

// export default function GameMap() {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
//         const img = new Image();
//         img.crossOrigin = "anonymous";
//         img.src = "/placeholder.svg?height=500&width=800";

//         img.onload = () => {
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//             destinations.forEach((dest) => {
//                 ctx.beginPath();
//                 ctx.arc(dest.mapX, dest.mapY, 8, 0, Math.PI * 2);
//                 ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
//                 ctx.fill();

//                 ctx.font = "12px Arial";
//                 ctx.fillStyle = "black";
//                 ctx.textAlign = "center";
//                 ctx.fillText(dest.name, dest.mapX, dest.mapY - 15);
//             });

//             ctx.beginPath();
//             ctx.moveTo(destinations[0].mapX, destinations[0].mapY);
//             for (let i = 1; i < destinations.length; i++) {
//                 ctx.lineTo(destinations[i].mapX, destinations[i].mapY);
//             }
//             ctx.strokeStyle = "rgba(0, 100, 255, 0.5)";
//             ctx.lineWidth = 3;
//             ctx.stroke();
//         };
//     }, []);

//     return (
//         <div className="relative w-full h-full">
//             <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-cover" />
//             {/* Animated clouds */}
//             <motion.div
//                 className="absolute top-10 left-20 w-16 h-8 bg-white rounded-full opacity-70"
//                 animate={{ x: [0, 100, 0], opacity: [0.7, 0.9, 0.7] }}
//                 transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//             />
//             <motion.div
//                 className="absolute top-20 right-40 w-20 h-10 bg-white rounded-full opacity-70"
//                 animate={{ x: [0, -120, 0], opacity: [0.7, 0.9, 0.7] }}
//                 transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//             />
//         </div>
//     );
// }