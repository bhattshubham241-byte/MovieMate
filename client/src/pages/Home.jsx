/*----- FILE: Home.jsx | CONTENT: Home page. Fetches movies from the backend API and displays the Now Showing section. -----*/

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import MovieCard from "../components/MovieCard";

import "../styles/home.css";

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");

        setMovies(response.data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <main className="home">

      {/*----- Hero Section -----*/}
      <section className="hero">
        <div className="hero-content">

          <p className="hero-tagline">
            YOUR MOVIE. YOUR SEAT. YOUR EXPERIENCE.
          </p>

          <h1>
            Movies for
            <span> Everyone.</span>
          </h1>

          <p className="hero-description">
            Discover the latest movies, find your favorite shows,
            and book your seats in just a few clicks.
          </p>

          <div className="hero-buttons">

            <Link
              to="/movies"
              className="hero-primary-button"
            >
              Explore Movies
            </Link>

            <Link
              to="/login"
              className="hero-secondary-button"
            >
              Login
            </Link>

          </div>

        </div>
      </section>

      {/*----- Now Showing -----*/}
      <section className="movie-section">

        <div className="section-header">

          <div>
            <p className="section-label">
              WHAT'S PLAYING
            </p>

            <h2>Now Showing</h2>
          </div>

          <Link
            to="/movies"
            className="view-all"
          >
            View All →
          </Link>

        </div>

        <div className="movie-grid">

          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
            />
          ))}

        </div>

      </section>

    </main>
  );
}

export default Home;