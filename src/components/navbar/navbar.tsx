import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isTokenValid } from "../tokenInfo";
import { useUserContext } from "../../context/userContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, deleteUser } = useUserContext();

  return (
    <nav className="bg-white shadow fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/accueil" className="text-2xl font-bold text-gray-800">
          fastoresto
        </Link>
        <div className="hidden md:flex gap-8">
          <Link to="/accueil" className="text-gray-700 ">
            Accueil
          </Link>
          {user ? (
            <>
              <Link
                to="/"
                className="text-gray-700 "
                onClick={() => deleteUser()}
              >
                Déconnexion
              </Link>
              <Link
                to="/admin/dashboard"
                className="text-gray-700 "
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 "
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
          <Link to="/contact" className="text-gray-700 ">
            Contact
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white border-black"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu avec animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white shadow overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              <Link
                to="/accueil"
                className="text-gray-700 "
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              {user ? (
                <>
                  <Link
                  to="/"
                    className="text-gray-700 "
                    onClick={() => deleteUser()}
                  >
                    Déconnexion
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 "
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 "
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
              <Link
                to="/contact"
                className="text-gray-700 "
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
