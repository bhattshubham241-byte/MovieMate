/*----- FILE: Login.jsx | CONTENT: User login page. | PURPOSE: Authenticates an existing MovieMate user and returns the user to the page they wanted to access. -----*/

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*----- REDIRECT LOCATION: ProtectedRoute sends the original page here so booking can continue after login. -----*/
  const redirectPath = location.state?.from?.pathname || "/";
  const redirectState = location.state?.from?.state;

  /*----- LOGIN SUBMIT: Sends credentials to the Express authentication API. -----*/
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data);

      /*----- ADMIN REDIRECT: Administrators always enter the administration dashboard and never resume a customer booking route. -----*/
      const destination = response.data.user?.role === "admin"
        ? "/admin"
        : redirectPath;

      navigate(destination, {
        replace: true,
        state: redirectState,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        {/*----- Left Side -----*/}
        <div className="auth-info">
          <div className="auth-brand">🎬 MovieMate</div>

          <h1>
            Welcome
            <span>back.</span>
          </h1>

          <p>
            Sign in to your MovieMate account and continue
            discovering movies and booking your favorite seats.
          </p>
        </div>

        {/*----- Right Side -----*/}
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to continue to MovieMate.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/*----- Email -----*/}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/*----- Password -----*/}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/*----- Forgot Password: UI link only; password recovery is not implemented yet. -----*/}
            <div className="forgot-password">
              <span>Forgot Password?</span>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
