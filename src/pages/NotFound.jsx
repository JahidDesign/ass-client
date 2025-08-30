import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext'; 

const NotFound = () => {
  const { theme } = useContext(ThemeContext); 

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Travel Tours Agency</title>
        <meta
          name="description"
          content="Oops! The page you're looking for doesn't exist or has been moved."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section
        className={`flex items-center justify-center min-h-screen px-6 ${
          theme === 'dark'
            ? 'bg-gray-900 text-gray-100'
            : 'bg-gradient-to-br from-white to-gray-100 text-gray-800'
        }`}
      >
        <div className="max-w-md w-full text-center animate-fadeIn">
          <h1
            className={`text-[100px] sm:text-[120px] font-extrabold mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            }`}
          >
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-sm sm:text-base mb-6 leading-relaxed text-gray-400">
            The page you’re looking for doesn’t exist or was moved. Don’t worry, you can always head back home.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-violet-600 text-white rounded-md shadow-md hover:bg-violet-700 transition-all duration-300"
          >
            Back to Homepage
          </Link>
        </div>
      </section>

      {/* Tailwind animation keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }
      `}</style>
    </>
  );
};

export default NotFound;
