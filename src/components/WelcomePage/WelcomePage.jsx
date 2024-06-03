import React from 'react';
import '../WelcomePage/WelcomePage.css'


// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function WelcomePage() {
  return (
    <div className="welcome-container">
        <h2 className="welcome-title lg-font">You need to paint your shed next week but there's rain in the forecast...</h2>
        <p className="welcome-blurb lg-font">Luckily, you have Sunny Day, the smart weather-enabled list app!</p>
        <ul className="welcome-list"><span className="lg-font">With Sunny Day, you can:</span>
         <li >Manage your daily life and plan your activities according to the weather!</li>
         <li >Enjoy real-time forecasts without having to have multiple windows open! </li>
         <li>Get real-time advice on moving your tasks around at the click of a button!</li> 
        </ul>
    </div>
  );
}

export default WelcomePage;
