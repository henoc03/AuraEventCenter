import React from "react";
import "../../style/auth.css"
import Logo from '../icons/Logo';

const Auth = ({ title, children }) => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
        <a href="/"><Logo className= "auth-logo"alt="Aura Event Center Logo" width={260} height={35}></Logo></a>
          <h2 className="auth-title">{title}</h2>

        </div>
        {children}
      </div>
    </div>
  );
};

export default Auth;
