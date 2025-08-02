import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/Routes';

const App = () => {
  const { pathname } = useLocation();

 
  const hideLayoutPaths = ['/login', '/register', '/404'];

  const shouldHideLayout = hideLayoutPaths.includes(pathname);

  return (
    <div className="bg-white">
      {!shouldHideLayout && <Navbar />}
      <AppRoutes />
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

export default App;
