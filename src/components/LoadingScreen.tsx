import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadTime?: number; // 最小加载时间（毫秒）
}

// 六芒星路径组件
function HexagramStar({ 
  size = 60, 
  color = '#10b981',
  rotating = false,
  scale = 1 
}: { 
  size?: number; 
  color?: string;
  rotating?: boolean;
  scale?: number;
}) {
  // 六芒星由两个等边三角形组成
  const triangleHeight = size * 0.866; // 等边三角形高度 = 边长 * √3/2
  
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `scale(${scale})`,
      }}
      animate={rotating ? { rotate: 360 } : {}}
      transition={rotating ? {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      } : {}}
    >
      {/* 上三角形 */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${triangleHeight}px solid ${color}`,
        }}
      />
      {/* 下三角形 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderTop: `${triangleHeight}px solid ${color}`,
        }}
      />
    </motion.div>
  );
}

// 正方形组件
function Square({ 
  size = 60, 
  color = '#10b981',
  rounded = false,
  rotating = false,
  scale = 1
}: { 
  size?: number; 
  color?: string;
  rounded?: boolean;
  rotating?: boolean;
  scale?: number;
}) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: rounded ? size / 4 : 0,
        transform: `scale(${scale})`,
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

// 加载进度条
function LoadingProgress({ progress }: { progress: number }) {
  return (
    <div style={{
      width: 200,
      height: 4,
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderRadius: 2,
      overflow: 'hidden',
      marginTop: 40,
    }}>
      <motion.div
        style={{
          height: '100%',
          backgroundColor: '#10b981',
          borderRadius: 2,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}

export function LoadingScreen({ 
  onLoadingComplete,
  minimumLoadTime = 3000 
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // 监听资源加载
  useEffect(() => {
    const startTime = Date.now();
    
    // 监听页面资源加载
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minimumLoadTime - elapsed);
      
      // 确保最小加载时间
      setTimeout(() => {
        setResourcesLoaded(true);
      }, remaining);
    };

    // 如果页面已经加载完成
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [minimumLoadTime]);

  // 动画阶段控制
  useEffect(() => {
    const phases = [
      { phase: 0, delay: 0 },        // 初始状态
      { phase: 1, delay: 500 },      // 正方形出现
      { phase: 2, delay: 800 },      // 分裂成两个
      { phase: 3, delay: 1200 },     // 一个变六芒星
      { phase: 4, delay: 1600 },     // 开始旋转
    ];

    phases.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setAnimationPhase(phase);
      }, delay);
    });
  }, []);

  // 进度条动画
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // 根据资源加载状态调整进度速度
        const increment = resourcesLoaded ? 5 : 2;
        return Math.min(prev + increment, 99);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [resourcesLoaded]);

  // 完成加载
  useEffect(() => {
    if (resourcesLoaded && progress >= 100) {
      setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, 500);
    }
  }, [resourcesLoaded, progress, onLoadingComplete]);

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
          {/* 动画容器 */}
          <div style={{
            position: 'relative',
            width: 200,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            
            {/* 阶段 0-1: 单个正方形 */}
            {animationPhase >= 0 && animationPhase < 2 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: animationPhase >= 1 ? 1 : 0,
                  rotate: 0,
                  x: animationPhase >= 2 ? -40 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <Square 
                  size={50} 
                  color="#10b981"
                  rotating={animationPhase >= 4}
                />
              </motion.div>
            )}

            {/* 阶段 2: 分裂成两个正方形 */}
            {animationPhase >= 2 && (
              <>
                {/* 左侧正方形 */}
                <motion.div
                  initial={{ x: 0, scale: 0 }}
                  animate={{ 
                    x: -45, 
                    scale: 1,
                    opacity: animationPhase >= 3 ? 0 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  style={{ position: 'absolute' }}
                >
                  <Square 
                    size={45} 
                    color="#10b981"
                    rotating={animationPhase >= 4}
                  />
                </motion.div>

                {/* 右侧正方形/六芒星 */}
                <motion.div
                  initial={{ x: 0, scale: 0 }}
                  animate={{ 
                    x: 45, 
                    scale: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: 0.1,
                  }}
                  style={{ position: 'absolute' }}
                >
                  {animationPhase >= 3 ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <HexagramStar 
                        size={50} 
                        color="#34d399"
                        rotating={animationPhase >= 4}
                      />
                    </motion.div>
                  ) : (
                    <Square 
                      size={45} 
                      color="#34d399"
                    />
                  )}
                </motion.div>
              </>
            )}

            {/* 阶段 3+: 六芒星旋转（如果左侧正方形已消失） */}
            {animationPhase >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  position: 'absolute',
                  left: -45,
                }}
              >
                <HexagramStar 
                  size={40} 
                  color="#059669"
                  rotating={animationPhase >= 4}
                />
              </motion.div>
            )}
          </div>

          {/* 加载文字 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 20,
              color: '#10b981',
              fontSize: '14px',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
            }}
          >
            {resourcesLoaded ? '加载完成' : '加载中...'}
          </motion.div>

          {/* 进度条 */}
          <LoadingProgress progress={progress} />

          {/* 百分比 */}
          <motion.div
            style={{
              marginTop: 10,
              color: '#6b7280',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 简化的加载动画（用于页面切换）
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
          <Square size={40} color="#10b981" rounded />
        </motion.div>
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        >
          <HexagramStar size={45} color="#34d399" />
        </motion.div>
      </div>
    </div>
  );
}

export default LoadingScreen;
