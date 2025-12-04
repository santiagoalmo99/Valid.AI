/**
 * Animation Utilities
 * Smooth, elegant, and modern Framer Motion configurations.
 * Focused on: lightness, smoothness, delicacy, and speed.
 */

import { Variants, Transition } from 'framer-motion';

// Spring Configurations - Smooth & Elegant
export const spring = {
  // Ultra-smooth for general use
  smooth: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 0.5
  } as Transition,
  
  // Gentle for subtle movements
  gentle: {
    type: "spring",
    stiffness: 80,
    damping: 18,
    mass: 0.4
  } as Transition,
  
  // Quick but smooth for interactions
  quick: {
    type: "spring",
    stiffness: 200,
    damping: 25,
    mass: 0.3
  } as Transition,
  
  // Subtle bounce for delightful moments
  subtle: {
    type: "spring",
    stiffness: 150,
    damping: 15,
    mass: 0.4
  } as Transition,

  // Fast for snappy feedback
  snappy: {
    type: "spring",
    stiffness: 300,
    damping: 30
  } as Transition
};

// Easing curves for tween animations
export const ease = {
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  out: [0, 0, 0.2, 1] as [number, number, number, number],
  in: [0.4, 0, 1, 1] as [number, number, number, number],
  inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  // Custom luxurious easing
  luxury: [0.16, 1, 0.3, 1] as [number, number, number, number]
};

// Base Fade Variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.3, ease: ease.smooth } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.15, ease: ease.out } 
  }
};

// Subtle upward float (elegant entrance)
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { ...spring.smooth, opacity: { duration: 0.25 } }
  },
  exit: { 
    opacity: 0, 
    y: -6, 
    transition: { duration: 0.15 } 
  }
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -12 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { ...spring.smooth, opacity: { duration: 0.25 } }
  },
  exit: { 
    opacity: 0, 
    y: 6, 
    transition: { duration: 0.15 } 
  }
};

// Elegant scale entrance
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { ...spring.smooth }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    transition: { duration: 0.12 } 
  }
};

// Card hover with subtle lift
export const cardHover: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: spring.gentle
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1 } 
  }
};

// Slide variants - smooth and contained
export const slideInRight: Variants = {
  initial: { x: 24, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1, 
    transition: spring.smooth 
  },
  exit: { 
    x: 12, 
    opacity: 0, 
    transition: { duration: 0.15 } 
  }
};

export const slideInLeft: Variants = {
  initial: { x: -24, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1, 
    transition: spring.smooth 
  },
  exit: { 
    x: -12, 
    opacity: 0, 
    transition: { duration: 0.15 } 
  }
};

// Stagger Container - Fast and fluid
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

// Stagger Item - Subtle and quick
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: spring.quick
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1 } 
  }
};

// Interactive states - Fast feedback
export const hoverScale = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 25 }
};

export const hoverLift = {
  y: -2,
  transition: { type: "spring", stiffness: 400, damping: 25 }
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Glow effect for active/success states
export const glowPulse: Variants = {
  initial: { boxShadow: "0 0 0 rgba(58, 255, 151, 0)" },
  animate: {
    boxShadow: [
      "0 0 0 rgba(58, 255, 151, 0)",
      "0 0 20px rgba(58, 255, 151, 0.2)",
      "0 0 0 rgba(58, 255, 151, 0)"
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Subtle pulse for loading
export const pulse: Variants = {
  initial: { scale: 1, opacity: 0.8 },
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shimmer for skeleton loading
export const shimmer: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Modal animations - Smooth and non-jarring
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.2 } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.15, delay: 0.05 } 
  }
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: spring.smooth
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    y: 4,
    transition: { duration: 0.15 } 
  }
};

// Toast/notification entrance
export const toastSlide: Variants = {
  initial: { opacity: 0, y: -12, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: spring.quick
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    scale: 0.95,
    transition: { duration: 0.15 } 
  }
};

// Button press feedback
export const buttonPress = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 25 }
};

// Floating animation for decorative elements
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Reveal animation for text
export const textReveal: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: ease.luxury }
  }
};

// List item entrance (for grids/lists)
export const listItem: Variants = {
  initial: { opacity: 0, x: -8 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: spring.gentle
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1 } 
  }
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.25, ease: ease.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

// Legacy exports for backwards compatibility
export const bouncy = spring.subtle;
export const snappy = spring.snappy;
export const cardPop = cardHover;
