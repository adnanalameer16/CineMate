import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import './Stats.css';

function Stats() {
  const [stats, setStats] = useState(null);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/stats?uid=${uid}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };

    if (uid) fetchStats();
  }, [uid]);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Your Movie Stats</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Liked</h3>
          <p>{stats.total_liked}</p>
        </div>
        <div className="stat-card">
          <h3>Total Disliked</h3>
          <p>{stats.total_disliked}</p>
        </div>
        <div className="stat-card">
          <h3>In Watchlist</h3>
          <p>{stats.total_watchlist}</p>
        </div>
        <div className="stat-card">
          <h3>Total Watched</h3>
          <p>{stats.total_watched}</p>
        </div>
        <div className="stat-card large">
          <h3>First Liked Movie</h3>
          <p>{stats.first_liked?.title || 'N/A'}</p>
          <span>{stats.first_liked?.timestamp?.slice(0, 10) || ''}</span>
        </div>
        <div className="stat-card large">
          <h3>Last Liked Movie</h3>
          <p>{stats.last_liked?.title || 'N/A'}</p>
          <span>{stats.last_liked?.timestamp?.slice(0, 10) || ''}</span>
        </div>
      </div>
    </div>
  );
}

export default Stats;
