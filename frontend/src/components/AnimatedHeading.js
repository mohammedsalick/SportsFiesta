import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHeading = () => {
    const text = "SportsFiesta: Where Team Spirit Meets Seamless Scoring!";
    
    const containerVariants = {
        hidden: { width: 0 },
        visible: {
            width: "100%",
            transition: {
                duration: 1,
                ease: "easeOut",
                delayChildren: 0.5,
                staggerChildren: 0.05
            }
        }
    };

    const letterVariants = {
        hidden: { 
            opacity: 0,
            x: -50
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200
            }
        },
        animate: {
            y: [0, -8, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className="overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-4xl md:text-5xl font-bold text-center my-8 text-indigo-800 px-4 whitespace-nowrap"
            >
                {text.split(" ").map((word, wordIndex) => (
                    <motion.span
                        key={wordIndex}
                        className="inline-block mx-2"
                    >
                        {word.split("").map((letter, letterIndex) => (
                            <motion.span
                                key={`${wordIndex}-${letterIndex}`}
                                className="inline-block"
                                variants={letterVariants}
                                animate="animate"
                            >
                                {letter === ":" ? (
                                    <span className="mx-1 text-indigo-600">{letter}</span>
                                ) : letter === "!" ? (
                                    <span className="text-indigo-600">{letter}</span>
                                ) : (
                                    letter
                                )}
                            </motion.span>
                        ))}
                    </motion.span>
                ))}
            </motion.h1>
        </motion.div>
    );
};

export default AnimatedHeading;
