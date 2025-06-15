import React from 'react';
import './Login.css'; // Reusing the same CSS
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const handleSignupClick= () =>{
    navigate('/main');
  };

  return (
    <div className="login-container">
      <h2>Create a Cinemate Account</h2>
      <form className="login-form">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Choose a username" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Create a password" required />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" placeholder="Confirm your password" required />

        <button onClick={handleSignupClick} type="submit">Sign Up</button>
      </form>
      <p className="signup-link">
        Already have an account? <a onClick={() => navigate('/login')}>Login here</a>
      </p>
    </div>
  );
}

export default Signup;
