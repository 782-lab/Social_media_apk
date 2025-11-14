// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem('userInfo'))
  );

  const loginSuccessHandler = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  // --- NAME CHANGED ---
  // Function name changed from 'followUpdateHandler' to 'userUpdateHandler'
  const userUpdateHandler = (updatedUserData) => {
    // Old token is necessary, so merging data
    const updatedInfo = { ...userInfo, ...updatedUserData };
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    setUserInfo(updatedInfo);
  };
  // -----------------------------

  return (
    <div className="app-container">
      {userInfo ? (
        <HomePage
          userInfo={userInfo}
          onLogout={logoutHandler}
          onUserUpdate={userUpdateHandler} // Prop name also updated
        />
      ) : (
        <AuthPage onLoginSuccess={loginSuccessHandler} />
      )}
    </div>
  );
}

export default App;
