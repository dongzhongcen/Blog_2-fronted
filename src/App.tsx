import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BlogPage from '@/pages/BlogPage';
import AllPostsPage from '@/pages/AllPostsPage';
import AdminPage from '@/pages/AdminPage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useTheme } from '@/contexts/ThemeContext';
import './App.css';

// AnimatedRoutes component to handle page transitions
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<BlogPage />} />
        <Route path="/posts" element={<AllPostsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme(); // 使用useTheme钩子

  return (
    <BrowserRouter>
      {/* 进场加载动画 */}
      {isLoading && (
        <LoadingScreen 
          onLoadingComplete={() => setIsLoading(false)}
          minimumLoadTime={3000}
        />
      )}
      
      {/* 主应用内容 */}
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;