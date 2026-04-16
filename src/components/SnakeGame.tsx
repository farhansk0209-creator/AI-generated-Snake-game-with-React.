import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Point } from '../types';
import { Button } from './ui/button';
import { Play, RotateCcw, Pause, Terminal } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const GAME_SPEED = 120;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState('PLAYING');
    setFood(generateFood(INITIAL_SNAKE));
  };

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameState, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameState === 'PLAYING') setGameState('PAUSED');
          else if (gameState === 'PAUSED') setGameState('PLAYING');
          else if (gameState === 'IDLE' || gameState === 'GAME_OVER') resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastUpdateTimeRef.current > GAME_SPEED) {
        update();
        lastUpdateTimeRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(animate);
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#ff00ff';
      
      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const size = cellSize - 2;
      
      ctx.fillRect(x, y, size, size);
      
      if (isHead) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
      }
    });

    ctx.fillStyle = '#ffffff';
    const foodX = food.x * cellSize + 2;
    const foodY = food.y * cellSize + 2;
    const foodSize = cellSize - 4;
    ctx.fillRect(foodX, foodY, foodSize, foodSize);
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.strokeRect(foodX, foodY, foodSize, foodSize);
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 bg-black/40 border border-cyan/20 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan/10" />
      
      <div className="flex justify-between w-full items-center px-2">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono uppercase text-cyan/40">DATA_VALUE: SCORE</span>
          <div className="text-2xl font-mono text-cyan glitch-text">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-mono uppercase text-magenta/40">DATA_VALUE: HIGH</span>
          <div className="text-xl font-mono text-magenta">
            {highScore.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      <div className="relative border-2 border-cyan/40">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black"
          style={{ imageRendering: 'pixelated' }}
        />
        
        <AnimatePresence>
          {gameState !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-mono text-white mb-8 glitch-text uppercase tracking-widest">
                {gameState === 'IDLE' ? 'SYSTEM_INIT' : gameState === 'PAUSED' ? 'HALT_COMMAND' : 'CORE_FAILURE'}
              </h2>
              
              <Button
                onClick={gameState === 'PAUSED' ? () => setGameState('PLAYING') : resetGame}
                className="bg-cyan text-black font-mono text-xs px-6 py-4 rounded-none hover:bg-white transition-all border-b-4 border-magenta"
              >
                {gameState === 'PAUSED' ? (
                  <><Play className="mr-2 w-3 h-3 fill-current" /> RESUME_PROCESS</>
                ) : gameState === 'IDLE' ? (
                  <><Play className="mr-2 w-3 h-3 fill-current" /> START_EXECUTION</>
                ) : (
                  <><RotateCcw className="mr-2 w-3 h-3" /> REBOOT_SYSTEM</>
                )}
              </Button>
              
              <div className="mt-8 flex flex-col items-center gap-1">
                <span className="text-[8px] font-mono text-cyan/40 uppercase tracking-widest">INPUT_MAPPING: ARROW_KEYS</span>
                <span className="text-[8px] font-mono text-cyan/40 uppercase tracking-widest">INTERRUPT: SPACE_BAR</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
