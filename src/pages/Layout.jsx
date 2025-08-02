// src/pages/Layout.jsx
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = () => {
  const { pathname } = useLocation();
  
  // Paths where you want to hide Navbar & Footer
  const hideLayoutPaths = ['/login', '/register', '/404'];

  const shouldHideLayout = hideLayoutPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default Layout;
