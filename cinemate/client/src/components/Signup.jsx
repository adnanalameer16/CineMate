import React, {useState} from 'react';
import './Login.css'; // Reusing the same CSS
import { useNavigate } from 'react-router-dom';


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');


  const navigate = useNavigate();
  const handleSignup = async (e) => {
  e.preventDefault(); // prevent page reload

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (data.success) {
      navigate('/main'); // successful signup
    } else {
      setError(data.message || 'Signup failed');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  }
};


  return (
    <div className="login-container">
      <h2>Create a Cinemate Account</h2>
      <form className="login-form" onSubmit={handleSignup}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Choose an email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Create a password" value={password}
        onChange={(e) => setPassword(e.target.value)}required />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}required />
        {error && <p className="error-message">{error}</p>}

        <button type="submit">Sign Up</button>
      </form>
      <p className="signup-link">
        Already have an account? <a onClick={() => navigate('/login')}>Login here</a>
      </p>
    </div>
  );
}

export default Signup;
