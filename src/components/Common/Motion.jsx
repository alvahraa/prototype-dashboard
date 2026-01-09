import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Animated Card Component - Bento Grid Style
 * 
 * Features:
 * - Glassmorphism with backdrop blur
 * - Hover lift effect
 * - Tap tactile feedback
 * - Slow, butter-smooth spring animations
 */

// Global smooth spring config - "Heavy & Luxurious"
const smoothSpring = {
  type: 'spring',
  stiffness: 100,
  damping: 25,
  mass: 1.2,
};

const hoverSpring = {
  type: 'spring',
  stiffness: 150,
  damping: 20,
  mass: 0.8,
};

// Card animation variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 15,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothSpring,
  },
};

export function MotionCard({ 
  children, 
  className, 
  hover = true,
  glass = false,
  ...props 
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={hover ? { y: -4, transition: hoverSpring } : {}}
      className={cn(
        'rounded-3xl p-6',
        'border border-gray-200/50',
        'shadow-sm hover:shadow-lg',
        'transition-shadow duration-300',
        glass && 'backdrop-blur-xl bg-white/80',
        !glass && 'bg-white',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Container with Staggered Children
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

export function MotionContainer({ children, className, ...props }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Button with Tactile Feedback
 */
export function MotionButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={hoverSpring}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * Page Wrapper with Fade-Slide Animation
 */
export function MotionPage({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={smoothSpring}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Grid for Bento Layout
 */
export function MotionGrid({ children, className, columns = 2, ...props }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <MotionContainer
      className={cn('grid gap-6', gridCols[columns], className)}
      {...props}
    >
      {children}
    </MotionContainer>
  );
}

export default {
  MotionCard,
  MotionContainer,
  MotionButton,
  MotionPage,
  MotionGrid,
};
