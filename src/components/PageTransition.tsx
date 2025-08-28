import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="absolute inset-0 w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;