import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode apply to <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full p-4
      bg-white/30 backdrop-blur-md text-gray-900 shadow-md
      dark:bg-gray-900 dark:text-white dark:shadow-lg"
     >
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side - Logo */}
        <h1 className="text-xl font-bold">My App</h1>

        {/* Right Side - Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400" size={20} />
          ) : (
            <FaMoon className="text-gray-200" size={20} />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
