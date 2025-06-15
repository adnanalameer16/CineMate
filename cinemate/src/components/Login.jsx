import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const handleLoginClick = () => {
    navigate('/main');
  };

  return (
    <div className="login-container">
      <h2>Login to Cinemate</h2>
      <form className="login-form">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Enter your username" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password" required />

        <button  onClick={handleLoginClick} type="submit">Login</button>
      </form>
      <p className="signup-link">
        Don't have an account? <a onClick={() => navigate('/signup')}>Create one</a>
      </p>
    </div>
  );
}

export default Login;
