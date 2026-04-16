import React from 'react';
import { motion } from 'motion/react';

export const GlitchBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505] overflow-hidden">
      {/* Static Noise */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-screen">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Screen Tearing Lines */}
      <motion.div
        animate={{
          top: ['-100%', '200%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 right-0 h-[2px] bg-magenta/20 blur-[1px] shadow-[0_0_10px_#ff00ff]"
      />
      
      <motion.div
        animate={{
          top: ['-100%', '200%'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        className="absolute left-0 right-0 h-[1px] bg-cyan/20 blur-[1px] shadow-[0_0_10px_#00ffff]"
      />

      {/* Grid Pattern (Retro-Futurist) */}
      <div 
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          perspective: '500px',
          transform: 'rotateX(60deg) translateY(-100px)',
          transformOrigin: 'top'
        }}
      />

      {/* CRT Scanlines Overlay */}
      <div className="absolute inset-0 crt-overlay opacity-40" />
    </div>
  );
};
