const pool = require('../db');

// Helper to group release years into decades (e.g., "2010s")
function getDecade(releaseDate) {
  if (!releaseDate) return null;
  const year = parseInt(releaseDate.slice(0, 4));
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

async function buildTasteProfile(uid) {
  const result = await pool.query(
    'SELECT * FROM user_movie_actions WHERE uid = $1',
    [uid]
  );

  const rows = result.rows;
  const liked = rows.filter(m => m.action === 'liked');
  const disliked = rows.filter(m => m.action === 'disliked');

  const genreCount = {};
  const decadeCount = {};
  const languageCount = {};
  let ratingSum = 0;

  liked.forEach(movie => {
    // Genres
    if (movie.genre) {
      movie.genre.split(',').map(g => g.trim()).forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    }

    // Decades
    const decade = getDecade(movie.release_date);
    if (decade) {
      decadeCount[decade] = (decadeCount[decade] || 0) + 1;
    }

    // Languages
    if (movie.language) {
      languageCount[movie.language] = (languageCount[movie.language] || 0) + 1;
    }

    // Rating average
    if (movie.rating) {
      ratingSum += parseFloat(movie.rating);
    }
  });

  const avgRating = liked.length ? parseFloat((ratingSum / liked.length).toFixed(1)) : null;

  const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(g => g[0]);
  const topDecades = Object.entries(decadeCount).sort((a, b) => b[1] - a[1]).slice(0, 2).map(d => d[0]);
  const topLanguages = Object.entries(languageCount).sort((a, b) => b[1] - a[1]).slice(0, 2).map(l => l[0]);

  return {
    topGenres,
    topLanguages,
    topDecades,
    avgRating,
    likedTmdbIds: liked.map(m => m.tmdb_id),
    dislikedTmdbIds: disliked.map(m => m.tmdb_id)
  };
}

module.exports = { buildTasteProfile };
