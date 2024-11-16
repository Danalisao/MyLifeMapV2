import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Toaster() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence />
    </div>
  );
}