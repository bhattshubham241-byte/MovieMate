/*----- FILE: Register.jsx | CONTENT: User registration page. | PURPOSE: Creates a new MovieMate account through the Express authentication API and logs the user in after successful registration. -----*/

import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/";
  const redirectState = location.state?.from?.state;

  /*----- REGISTER SUBMIT: Sends the new user's details to the Express registration API. -----*/
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });

      login(response.data);

      navigate(redirectPath, {
        replace: true,
        state: redirectState,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Registration failed. Please try again."
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
            Your movie journey
            <span> starts here.</span>
          </h1>

          <p>
            Create your MovieMate account and discover movies,
            book your favorite seats, and enjoy the show.
          </p>
        </div>

        {/*----- Right Side -----*/}
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join MovieMate and start booking your movies.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/*----- Name -----*/}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <div className="input-wrapper">
                <User size={18} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  minLength="6"
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

            {/*----- Confirm Password -----*/}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>

              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/*----- Terms -----*/}
            <div className="auth-terms">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
              />

              <label htmlFor="terms">
                I agree to the Terms & Conditions
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
