import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className="container">
      {/* <h2>{heading}</h2> */}
      <div className="grid">
        <div className="grid-col grid-col_6">
        <div className="welcome-container">
        <h2 className="welcome-title lg-font">You need to paint your shed next week but there's rain in the forecast...</h2>
        <p className="welcome-blurb lg-font">Luckily, you have Sunny Day, the smart weather-enabled list app!</p>
        <ul className="welcome-list"><span className="lg-font">With Sunny Day, you can:</span>
         <li >Manage your daily life and plan your activities according to the weather!</li>
         <li >Enjoy real-time forecasts without having to have multiple windows open! </li>
         <li>Get real-time advice on moving your tasks around at the click of a button!</li> 
        </ul>
    </div>
        </div>
        <div className="grid-col grid-col_6">
          <RegisterForm />

          <center>
            <h4>Already a Member?</h4>
            <button className="btn btn_sizeSm" onClick={onLogin}>
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
