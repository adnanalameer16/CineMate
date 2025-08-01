import React,{ useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // clear previous error

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/main');
    } catch (err) {
  console.error('Firebase Auth Error:', err.code);

  switch (err.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      setError('Invalid username or password');
      break;
    case 'auth/invalid-email':
      setError('Invalid email format');
      break;
    case 'auth/too-many-requests':
      setError('Too many attempts. Try again later.');
      break;
    default:
      setError('Login failed. Please try again.');
  }
}

  };

  return (
    <div className="login-container">
      <h2>Login to Cinemate</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="email">Username</label>
        <input type="email" id="username" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}required />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>

      </form>
      <p className="signup-link">
        Don't have an account? <a onClick={() => navigate('/signup')}>Create one</a>
      </p>
    </div>
  );
}

export default Login;
