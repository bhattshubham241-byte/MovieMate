/*----- FILE: MovieDetails.jsx | CONTENT: Movie details page. Fetches one movie by ID and displays complete movie information. -----*/

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Clock, Calendar, Play } from "lucide-react";
import api from "../services/api";

import "../styles/movieDetails.css";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`);

        setMovie(response.data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return (
      <main className="movie-details-page">
        <div className="movie-loading">
          Loading movie...
        </div>
      </main>
    );
  }

  return (
    <main className="movie-details-page">

      <section className="movie-details-container">

        {/*----- Poster -----*/}
        <div className="movie-details-poster">
          <img
            src={movie.poster}
            alt={movie.title}
          />
        </div>

        {/*----- Information -----*/}
        <div className="movie-details-info">

          <p className="movie-details-label">
            MOVIE DETAILS
          </p>

          <h1>{movie.title}</h1>

          <div className="movie-details-rating">
            <Star size={18} fill="currentColor" />
            <span>{movie.rating}</span>
          </div>

          <div className="movie-details-meta">

            <span>
              <Clock size={16} />
              {movie.duration}
            </span>

            <span>
              <Calendar size={16} />
              {new Date(movie.releaseDate).getFullYear()}
            </span>

            <span>
              {movie.language}
            </span>

          </div>

          <div className="movie-details-genres">
            {movie.genre.map((genre) => (
              <span key={genre}>
                {genre}
              </span>
            ))}
          </div>

          <p className="movie-details-description">
            {movie.description}
          </p>

          <div className="movie-details-actions">

            <Link
              to={`/book/${movie._id}`}
              className="book-button"
            >
              Book Tickets
            </Link>

            {movie.trailer && (
              <a
                href={movie.trailer}
                target="_blank"
                rel="noreferrer"
                className="trailer-button"
              >
                <Play size={18} />
                Watch Trailer
              </a>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default MovieDetails;