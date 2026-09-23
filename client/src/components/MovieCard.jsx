/*----- FILE: MovieCard.jsx | CONTENT: Reusable movie card component. Displays poster, rating, movie metadata, genres, and details link. -----*/

import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";

import "../styles/movieCard.css";

function MovieCard({ movie }) {
  return (
    <article className="movie-card">

      {/*----- Movie Poster -----*/}
      <div className="movie-card-poster">
        <img
          src={movie.poster}
          alt={movie.title}
        />

        <div className="movie-card-rating">
          <Star size={14} fill="currentColor" />
          <span>{movie.rating}</span>
        </div>
      </div>

      {/*----- Movie Information -----*/}
      <div className="movie-card-content">

        <h3 className="movie-card-title">
          {movie.title}
        </h3>

        <div className="movie-card-meta">
          <span>{movie.language}</span>

          <span className="movie-card-separator">
            •
          </span>

          <span className="movie-card-duration">
            <Clock size={14} />
            {movie.duration}
          </span>
        </div>

        <div className="movie-card-genres">
          {movie.genre?.slice(0, 2).map((genre) => (
            <span key={genre} className="movie-card-genre">
              {genre}
            </span>
          ))}
        </div>

        <Link
          to={`/movies/${movie._id}`}
          className="movie-card-button"
        >
          View Details
        </Link>

      </div>

    </article>
  );
}

export default MovieCard;