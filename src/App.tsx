import { GlitchBackground } from './components/GlitchBackground';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Terminal, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen text-cyan font-sans selection:bg-magenta/30 selection:text-white">
      <GlitchBackground />
      
      <main className="container mx-auto px-4 py-8 flex flex-col items-center gap-8">
        {/* Machine Header */}
        <header className="flex flex-col items-center text-center gap-2 border-b border-cyan/20 pb-8 w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            className="flex items-center gap-2 px-3 py-0.5 bg-magenta/10 border border-magenta/30"
          >
            <Activity className="w-3 h-3 text-magenta animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-magenta">CORE_STATUS: UNSTABLE</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-mono tracking-tight uppercase glitch-text"
          >
            NEON_SYNTH_V2
          </motion.h1>
          
          <div className="flex gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan/40">
            <span>[ PROTOCOL: SNAKE ]</span>
            <span>[ FREQUENCY: LO-FI ]</span>
            <span>[ STATUS: CRYPTIC ]</span>
          </div>
        </header>

        {/* Main Interface Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Execution Chamber (Game) */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-magenta" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-magenta">EXECUTION_CHAMBER</h2>
              </div>
              <span className="text-[8px] font-mono text-cyan/20 animate-pulse">0x4F2A_MEM_DUMP</span>
            </div>
            <div className="border border-cyan/30 p-1 bg-cyan/5">
              <SnakeGame />
            </div>
          </motion.section>

          {/* Sub-Systems (Sidebar) */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Audio Processor */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <Activity className="w-4 h-4 text-magenta" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-magenta">AUDIO_PROCESSOR</h2>
              </div>
              <div className="border border-magenta/30 p-1 bg-magenta/5">
                <MusicPlayer />
              </div>
            </div>

            {/* Machine Diagnostics */}
            <div className="border border-cyan/20 bg-black/60 backdrop-blur-sm p-4 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan/40 animate-glitch" />
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-cyan" />
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-cyan/60">DIAGNOSTICS</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-mono uppercase">
                    <span>NEURAL_LOAD</span>
                    <span className="text-magenta">88%</span>
                  </div>
                  <div className="h-1 bg-cyan/10 border border-cyan/20">
                    <motion.div
                      animate={{ width: ["10%", "90%", "40%", "88%"] }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="h-full bg-magenta shadow-[0_0_5px_#ff00ff]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-mono uppercase">
                    <span>VOID_SYNC</span>
                    <span className="text-cyan">ACTIVE</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          backgroundColor: ["#00ffff", "#ff00ff", "#00ffff"],
                          opacity: [0.2, 1, 0.2]
                        }}
                        transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.05 }}
                        className="w-2 h-2 border border-cyan/20"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[8px] font-mono text-magenta/40 leading-tight">
                WARNING: VOID_LEAK DETECTED IN SECTOR_7. <br/>
                REBOOT_PROTOCOL_DISABLED.
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Machine Footer */}
        <footer className="mt-8 border-t border-cyan/10 pt-4 w-full text-center text-cyan/20 font-mono text-[8px] uppercase tracking-[0.5em]">
          TERMINAL_ID: 0xDEADBEEF // SYSTEM_TIME: {new Date().toISOString()}
        </footer>
      </main>
    </div>
  );
}
