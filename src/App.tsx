import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BlogPage from '@/pages/BlogPage';
import AllPostsPage from '@/pages/AllPostsPage';
import AdminPage from '@/pages/AdminPage';
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
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
