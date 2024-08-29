import React, { useState } from 'react';
import FacebookLoginComponent from './FacebookLoginComponent';
import PageInsights from './PageInsights';
import './App.css'; 

const App = () => {
  const [userAccessToken, setUserAccessToken] = useState('');

  const handleLoginSuccess = (response) => {
    setUserAccessToken(response.accessToken);
  };

  return (
    <div className="App">
      <h1>Facebook Page Insights</h1>
      <FacebookLoginComponent onLoginSuccess={handleLoginSuccess} />
      {userAccessToken && <PageInsights accessToken={userAccessToken} />}
    </div>
  );
};

export default App;
