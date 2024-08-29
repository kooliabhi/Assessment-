import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookLoginComponent = ({ onLoginSuccess }) => {
  const [user, setUser] = useState(null);
  const [showLoginButton, setShowLoginButton] = useState(true);

  const responseFacebook = (response) => {
    console.log(response);
    setUser(response);
    setShowLoginButton(false);
    onLoginSuccess(response);
  };

  const handleLoginClick = () => {
    setShowLoginButton(false);
  };

  return (
    <div>
      {showLoginButton ? (
        <button className="login-button" onClick={handleLoginClick}>Login with Facebook</button>
      ) : !user ? (
        <FacebookLogin
          appId="1447428605947554" // Replace with your Facebook App ID
          fields="name,email,picture"
          scope="pages_show_list,pages_read_engagement,pages_read_user_content"
          callback={responseFacebook}
          autoLoad={false}  // Prevent auto-login
          icon="fa-facebook"
        />
      ) : (
        <div className="profile-container">
          <img src={user.picture.data.url} alt={user.name} />
          <h3>Welcome, {user.name}</h3>
        </div>
      )}
    </div>
  );
};

export default FacebookLoginComponent;
