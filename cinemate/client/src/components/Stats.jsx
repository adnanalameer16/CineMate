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
    <div className="stats-container">
      <h2>📊 Your Movie Stats</h2>
      <ul>
        <li>❤️ Total Liked: {stats.total_liked}</li>
        <li>💔 Total Disliked: {stats.total_disliked}</li>
        <li>📌 Watchlist Count: {stats.total_watchlist}</li>
        <li>🎥 Total Watched: {stats.total_watched}</li>
        <li>🕐 First Liked Movie: {stats.first_liked?.title || 'N/A'} ({stats.first_liked?.timestamp?.slice(0, 10) || 'N/A'})</li>
        <li>🕐 Last Liked Movie: {stats.last_liked?.title || 'N/A'} ({stats.last_liked?.timestamp?.slice(0, 10) || 'N/A'})</li>
      </ul>
    </div>
  );
}

export default Stats;
