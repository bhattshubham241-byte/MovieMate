/*----- FILE: Movies.jsx | CONTENT: Movies page. Fetches movies and filters them using the search input. -----*/

import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, SlidersHorizontal } from "lucide-react";

import MovieCard from "../components/MovieCard";

import "../styles/movies.css";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="movies-page">

      {/*----- Page Header -----*/}
      <section className="movies-header">

        <div>
          <p className="movies-label">
            DISCOVER
          </p>

          <h1>Movies</h1>

          <p className="movies-description">
            Explore the latest movies and find your next
            favorite film.
          </p>
        </div>

      </section>

      {/*----- Search & Filter -----*/}
      <section className="movies-controls">

        <div className="movie-search">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <button className="filter-button">
          <SlidersHorizontal size={18} />
          Filters
        </button>

      </section>

      {/*----- Movie Count -----*/}
      <div className="movies-results">

        <p>
          {filteredMovies.length}{" "}
          {filteredMovies.length === 1 ? "Movie" : "Movies"}
        </p>

      </div>

      {/*----- Movies -----*/}
      <section className="movies-grid">

        {filteredMovies.length > 0 ? (

          filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
            />
          ))

        ) : (

          <div className="no-movies">
            <h3>No movies found</h3>

            <p>
              Try searching for a different movie.
            </p>
          </div>

        )}

      </section>

    </main>
  );
}

export default Movies;