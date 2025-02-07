import Image from 'next/image';
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiBell, FiHome, FiLogOut, FiMoon, FiSun } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mock user data
  const user = {
    name: "John Doe",
    role: "Senior Developer",
    avatar: "/cesar-rincon-XHVpWcr5grQ-unsplash.jpg",
    notifications: 3
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    setShowLogoutModal(false);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border bg-slate-200 ${isDark ? "bg-dark.card.DEFAULT text-dark.card.foreground" : "bg-card.DEFAULT text-card.foreground"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <FiHome className="h-8 w-8 text-black cursor-pointer" />
          </div>

          {/* Right section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <FiBell className="h-5 w-5 cursor-pointer" />
              {user.notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-destructive text-destructive-foreground rounded-full">
                  {user.notifications}
                </span>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 focus:outline-none"
                aria-label="User menu"
              >
                <Image
                  src={user.avatar}
                  alt="User avatar"
                  width={500}
                  height={500}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-accent">{user.role}</p>
                  </div>
                  <hr className="border-border" />
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors flex items-center space-x-2"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="Main menu"
            >
              <AiOutlineMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card">
            <div className="flex flex-col space-y-4 p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={user.avatar}
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-accent text-sm">{user.role}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary transition-colors"
              >
                {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-2 p-2 rounded-md text-destructive hover:bg-secondary transition-colors"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-background opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium">Confirm Logout</h3>
                    <div className="mt-2">
                      <p className="text-accent">Are you sure you want to logout?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-secondary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-destructive text-base font-medium text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-border shadow-sm px-4 py-2 bg-card text-base font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
