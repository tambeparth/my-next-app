"use client"

import { motion } from "framer-motion"

export default function GameCharacter({ position }: { position: { x: number; y: number } }) {
    return (
        <motion.div
            className="absolute w-12 h-12 z-10"
            animate={{
                x: position.x - 24, // Center the character on the position
                y: position.y - 24,
            }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
            }}
        >
            <div className="relative w-full h-full">
                {/* Character body */}
                <motion.div
                    className="absolute bottom-0 w-10 h-10 bg-blue-500 rounded-full border-2 border-blue-700 flex items-center justify-center"
                    animate={{
                        y: [0, -5, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                >
                    <span className="text-white text-xs font-bold">✈️</span>
                </motion.div>

                {/* Shadow */}
                <motion.div
                    className="absolute bottom-0 left-1 w-8 h-2 bg-black/20 rounded-full"
                    animate={{
                        width: [8, 10, 8],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            </div>
        </motion.div>
    )
}

