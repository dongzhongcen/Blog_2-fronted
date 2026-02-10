import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadTime?: number;
}

// 六芒星组件
function HexagramStar({ 
  size = 60, 
  color = '#10b981',
  rotating = false
}: { 
  size?: number; 
  color?: string;
  rotating?: boolean;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      animate={rotating ? { rotate: 360 } : {}}
      transition={rotating ? {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      } : {}}
    >
      {/* 六芒星路径 */}
      <polygon
        points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
        fill={color}
      />
    </motion.svg>
  );
}

// 正方形组件
function Square({ 
  size = 60, 
  color = '#10b981',
  rotating = false
}: { 
  size?: number; 
  color?: string;
  rotating?: boolean;
}) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 4,
      }}
      animate={rotating ? { rotate: 360 } : {}}
      transition={rotating ? {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      } : {}}
    />
  );
}

export function LoadingScreen({ 
  onLoadingComplete,
  minimumLoadTime = 3000 
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'appear' | 'split' | 'transform' | 'rotate' | 'done'>('appear');
  const [progress, setProgress] = useState(0);

  // 阶段切换控制
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    // 阶段 1: 正方形出现
    timers.push(setTimeout(() => setPhase('split'), 600));
    
    // 阶段 2: 分裂
    timers.push(setTimeout(() => setPhase('transform'), 1000));
    
    // 阶段 3: 变六芒星
    timers.push(setTimeout(() => setPhase('rotate'), 1500));
    
    // 阶段 4: 旋转并加载
    timers.push(setTimeout(() => setPhase('done'), minimumLoadTime));
    
    return () => timers.forEach(clearTimeout);
  }, [minimumLoadTime]);

  // 进度条动画
  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const targetProgress = Math.min((elapsed / minimumLoadTime) * 100, 100);
      
      setProgress(targetProgress);
      
      if (targetProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [minimumLoadTime]);

  // 完成加载
  const handleComplete = useCallback(() => {
    setIsVisible(false);
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  useEffect(() => {
    if (phase === 'done' && progress >= 100) {
      const timer = setTimeout(handleComplete, 300);
      return () => clearTimeout(timer);
    }
  }, [phase, progress, handleComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          {/* 动画区域 */}
          <div style={{
            width: 200,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* 阶段 1: 单个正方形 */}
            {(phase === 'appear' || phase === 'split') && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  x: phase === 'split' ? -50 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <Square size={50} color="#10b981" />
              </motion.div>
            )}

            {/* 阶段 2: 分裂成两个 */}
            {phase === 'split' && (
              <motion.div
                initial={{ scale: 0, x: 0 }}
                animate={{ scale: 1, x: 50 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <Square size={50} color="#34d399" />
              </motion.div>
            )}

            {/* 阶段 3-4: 左侧正方形 + 右侧六芒星 */}
            {(phase === 'transform' || phase === 'rotate' || phase === 'done') && (
              <>
                {/* 左侧正方形 */}
                <motion.div
                  initial={{ x: -50, scale: 0 }}
                  animate={{ 
                    x: -45, 
                    scale: 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Square 
                    size={45} 
                    color="#059669" 
                    rotating={phase === 'rotate' || phase === 'done'}
                  />
                </motion.div>

                {/* 右侧六芒星 */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    x: 45,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <HexagramStar 
                    size={50} 
                    color="#34d399"
                    rotating={phase === 'rotate' || phase === 'done'}
                  />
                </motion.div>
              </>
            )}
          </div>

          {/* 加载文字 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: 20,
              color: '#10b981',
              fontSize: '14px',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
            }}
          >
            {progress >= 100 ? '加载完成' : '加载中...'}
          </motion.div>

          {/* 进度条 */}
          <div style={{
            width: 200,
            height: 4,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderRadius: 2,
            overflow: 'hidden',
            marginTop: 20,
          }}>
            <motion.div
              style={{
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: 2,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* 百分比 */}
          <motion.div
            style={{
              marginTop: 10,
              color: '#6b7280',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            {Math.round(progress)}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 简化的加载动画
export function SimpleLoadingAnimation() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
    }}>
      <div style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center',
      }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Square size={40} color="#10b981" />
        </motion.div>
        <motion.div
          animate={{ 
            rotate: -360,
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          }}
        >
          <HexagramStar size={45} color="#34d399" rotating />
        </motion.div>
      </div>
    </div>
  );
}

export default LoadingScreen;
