import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/Routes';
import { ThemeContext } from './context/ThemeContext';

const App = () => {
  const { pathname } = useLocation();
  const { theme } = useContext(ThemeContext);

  const hideLayoutPaths = ['/login', '/register', '/404','/*'];
  const shouldHideLayout = hideLayoutPaths.includes(pathname);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} transition-colors duration-300 min-h-screen`}>
      {!shouldHideLayout && <Navbar />}
      <AppRoutes />
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

export default App;
