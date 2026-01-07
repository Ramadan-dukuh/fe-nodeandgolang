import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-2">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l0.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-0.9-2-2-2z" />
              </svg>
            </div>
            <span className="text-white text-xl font-bold">ShopHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-white hover:text-indigo-100 transition-colors font-semibold"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/orders"
                  className="text-white hover:text-indigo-100 transition-colors font-semibold"
                >
                  My Orders
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-indigo-100 transition-colors font-semibold"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-white hover:text-indigo-100 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <User size={20} />
                  <div>
                    <p className="text-sm font-semibold">{user.nama}</p>
                    <p className="text-xs text-indigo-200">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-indigo-100 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-100 transition-colors font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-white p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-indigo-100 transition-colors font-semibold px-2 py-2"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block text-white hover:text-indigo-100 transition-colors font-semibold px-2 py-2"
                >
                  My Orders
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-indigo-100 transition-colors font-semibold px-2 py-2"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}

            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-white hover:text-indigo-100 transition-colors font-semibold px-2 py-2"
            >
              <ShoppingCart size={20} />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            {user ? (
              <>
                <div className="flex items-center gap-2 text-white px-2 py-2 border-t border-indigo-500">
                  <User size={20} />
                  <div>
                    <p className="text-sm font-semibold">{user.nama}</p>
                    <p className="text-xs text-indigo-200">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-white hover:bg-indigo-700 px-2 py-2 rounded transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t border-indigo-500">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-white hover:text-indigo-100 transition-colors font-semibold px-2 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
