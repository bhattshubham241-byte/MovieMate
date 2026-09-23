/*----- FILE: Navbar.jsx | CONTENT: Role-based MovieMate navigation bar. | PURPOSE: Gives normal users access to browsing and booking features while giving administrators access only to administration controls. -----*/

import { Link, useNavigate } from "react-router-dom";
import { Search, Ticket, User, Menu, X, LogOut, ShieldCheck, Sun, Moon } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /*----- LOGOUT: Clears the authentication state and sends the user to Home. -----*/
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/*----- LOGO: Administrators return to the dashboard; normal users return to Home. -----*/}
        <Link to={user?.role === "admin" ? "/admin" : "/"} className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🎬</span>
          <span>MovieMate</span>
        </Link>

        {/*----- DESKTOP NAVIGATION: Admin accounts do not receive user browsing/booking links. -----*/}
        {user?.role !== "admin" && (
          <nav className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/movies" className="nav-link">Movies</Link>

            {isAuthenticated && (
              <Link to="/my-bookings" className="nav-link">
                <Ticket size={18} />
                My Bookings
              </Link>
            )}
          </nav>
        )}

        {/*----- Desktop Actions -----*/}
        <div className="navbar-actions">
          {/*----- SEARCH: Only normal users and guests need movie browsing/search. -----*/}
          {user?.role !== "admin" && (
            <button
              className="search-button"
              type="button"
              onClick={() => navigate("/movies")}
              aria-label="Search movies"
            >
              <Search size={20} />
            </button>
          )}

          {/*----- THEME TOGGLE: Switches between Light Mode and Dark Mode. -----*/}
          <button
            className="theme-toggle-button"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              {/*----- ADMIN NAVIGATION: Admin sees only the administration dashboard link. -----*/}
              {user?.role === "admin" && (
                <Link to="/admin" className="admin-nav-link">Admin Dashboard</Link>
              )}
              <span className="navbar-user">
                <User size={18} />
                Hi, {user?.name?.split(" ")[0] || "User"}
              </span>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button">Login</Link>
              <Link to="/register" className="register-button">Register</Link>
            </>
          )}
        </div>

        {/*----- Mobile Menu Button -----*/}
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/*----- Mobile Navigation -----*/}
      {menuOpen && (
        <div className="mobile-menu">
          {/*----- MOBILE USER LINKS: Hidden for administrators. -----*/}
          {user?.role !== "admin" && (
            <>
              <Link to="/" onClick={closeMenu}>Home</Link>
              <Link to="/movies" onClick={closeMenu}>Movies</Link>

              {isAuthenticated && (
                <Link to="/my-bookings" onClick={closeMenu}>
                  <Ticket size={18} />
                  My Bookings
                </Link>
              )}
            </>
          )}

          {/*----- MOBILE THEME TOGGLE: Provides the same theme control on small screens. -----*/}
          <button
            type="button"
            className="mobile-theme-button"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          {isAuthenticated ? (
            <>
              {/*----- ADMIN MOBILE NAVIGATION: Only administration access and logout remain. -----*/}
              {user?.role === "admin" && (
                <Link to="/admin" onClick={closeMenu}>
                  <ShieldCheck size={18} />
                  Admin Dashboard
                </Link>
              )}
              <button type="button" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                <User size={18} />
                Login
              </Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
