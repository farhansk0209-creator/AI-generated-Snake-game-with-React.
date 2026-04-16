import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Activity } from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'CYBER_DRIFT.MP3',
    artist: 'NEON_AI_01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    duration: 372,
  },
  {
    id: '2',
    title: 'SYNTH_DREAMS.SYS',
    artist: 'RETRO_BOT_X',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/synth/400/400',
    duration: 425,
  },
  {
    id: '3',
    title: 'MIDNIGHT_PROTOCOL.LOG',
    artist: 'DIGITAL_GHOST_9',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/protocol/400/400',
    duration: 318,
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    let nextIndex = direction === 'next' ? currentTrackIndex + 1 : currentTrackIndex - 1;
    if (nextIndex >= DUMMY_TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = DUMMY_TRACKS.length - 1;
    
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    setProgress(0);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  return (
    <div className="w-full bg-black/40 border border-magenta/20 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-magenta/10" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      <div className="flex flex-col gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 flex-shrink-0 border border-magenta/40 p-0.5 bg-magenta/5">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-125"
              referrerPolicy="no-referrer"
              style={{ imageRendering: 'pixelated' }}
            />
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                  className="absolute inset-0 bg-magenta mix-blend-overlay"
                />
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-sm font-mono text-white truncate tracking-widest uppercase glitch-text">
              {currentTrack.title}
            </h3>
            <p className="text-magenta/60 font-mono text-[8px] uppercase tracking-[0.3em]">
              SOURCE: {currentTrack.artist}
            </p>
            <div className="mt-1 flex gap-0.5 h-3 items-end">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying ? [2, 12, 4, 10, 2] : 2
                  }}
                  transition={{
                    duration: 0.3 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                  className="w-1 bg-magenta/40"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSliderChange}
            className="cursor-crosshair"
          />
          <div className="flex justify-between text-[7px] font-mono text-cyan/40 uppercase tracking-widest">
            <span>T_CURR: {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
            <span>T_TOTAL: {audioRef.current ? formatTime(audioRef.current.duration || 0) : '0:00'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSkip('prev')}
              className="text-cyan hover:text-white hover:bg-cyan/10 rounded-none h-8 w-8"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </Button>
            
            <Button
              size="icon"
              onClick={togglePlay}
              className="w-10 h-10 rounded-none bg-cyan text-black hover:bg-white transition-all border-b-4 border-magenta"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSkip('next')}
              className="text-cyan hover:text-white hover:bg-cyan/10 rounded-none h-8 w-8"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </Button>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 border border-cyan/10">
            <Activity className="w-3 h-3 text-cyan/60" />
            <Slider
              value={[volume]}
              max={100}
              onValueChange={(v) => {
                setVolume(v[0]);
                if (audioRef.current) audioRef.current.volume = v[0] / 100;
              }}
              className="w-16"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
