// frontend/src/components/AuthPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css'; // We renamed App.css

// This component takes 2 functions via props
function AuthPage({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const signupHandler = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        '/api/users/register',
        { name, email, password },
        config
      );
      console.log(data);
      alert('Signup Successful!');
      onLoginSuccess(data); // Tell parent component (App.jsx) that login happened
    } catch (error) {
      alert('Error: ' + error.response.data.message);
    }
  };

  const loginHandler = async () => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );
      console.log(data);
      alert('Login Successful!');
      onLoginSuccess(data); // Tell parent component (App.jsx) that login happened
    } catch (error) {
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="title">{isLoginView ? 'Login' : 'Create Account'}</h1>
      <p className="subtitle">Connect, Share, and Engage</p>

      {!isLoginView && (
        <>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {isLoginView ? (
        <button className="btn btn-primary" onClick={loginHandler}>
          Login
        </button>
      ) : (
        <button className="btn btn-primary" onClick={signupHandler}>
          Sign Up
        </button>
      )}

      <div className="separator">
        <span>Or</span>
      </div>

      <button className="btn btn-secondary" onClick={toggleView}>
        {isLoginView ? 'Create New Account' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default AuthPage;