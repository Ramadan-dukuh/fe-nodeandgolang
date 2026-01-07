import { useState } from "react";

function Sidebar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsOpen(false); // Close sidebar on mobile after selecting
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-indigo-600 text-white p-2 rounded-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-xl z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-indigo-600">
          <h1 className="text-2xl font-bold text-white">DashBoard</h1>
          <p className="text-indigo-200 text-sm">Management System</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6">
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => handleNavClick("dashboard")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                  currentPage === "dashboard"
                    ? "bg-white text-indigo-700 font-semibold shadow-lg"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("users")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                  currentPage === "users"
                    ? "bg-white text-indigo-700 font-semibold shadow-lg"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                User Management
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-600">
          <p className="text-indigo-200 text-xs text-center">
            © 2026 Dashboard
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
