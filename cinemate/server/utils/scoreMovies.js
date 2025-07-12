function getDecade(releaseDate) {
  if (!releaseDate) return null;
  const year = parseInt(releaseDate.slice(0, 4));
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

function scoreMovie(movie, profile) {
  let score = 0;

  // 🎭 Genre Match
  const movieGenres = (movie.genre_ids || []).map(id => id.toString()); // TMDB uses genre_ids
  const userGenres = profile.topGenres || [];

  const genreMatchCount = userGenres.filter(userGenre =>
    movie.genre_names?.includes(userGenre)
  ).length;

  if (genreMatchCount > 0) score += 40;

  // 🗣 Language Match
  if (profile.topLanguages.includes(movie.original_language)) {
    score += 20;
  }

  // ⭐ Rating Near Avg (within ±1.0)
  if (profile.avgRating && movie.vote_average) {
    const diff = Math.abs(movie.vote_average - profile.avgRating);
    if (diff <= 1.0) score += 20;
  }

  // 📆 Decade Match
  const movieDecade = getDecade(movie.release_date);
  if (profile.topDecades.includes(movieDecade)) {
    score += 10;
  }

  // 🔥 Popularity
  if (movie.popularity >= 50) { // You can tune this threshold
    score += 10;
  }

  return score;
}

function scoreAndSortMovies(movies, profile) {
  const scored = movies.map(movie => ({
    ...movie,
    score: scoreMovie(movie, profile)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

module.exports = { scoreAndSortMovies };
