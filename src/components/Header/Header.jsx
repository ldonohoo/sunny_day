import React from 'react';
import { useSelector } from 'react-redux';
import '../Header/Header.css';
// import Logo from './images/sunny_day_logo.svg';

function Header() {
  const user = useSelector((store) => store.user);

  return (
        <div className="header">
            <div className="text-backing"></div>
            <div className="happy-cloud-box">
                <img className="logo" 
                     src='./images/sunny_logo.svg' 
                     alt="Sunny Day: the smart, weather-enabled list app" />
                    {/* <Logo width="50px" height="50px" alt="Sunny Day: the smart, weather-enabled list app" />      */}
                    {/* <h2 className="header-title">Sunny Day</h2>
                    <h3 className='header-tagline med-lg-font font-weight-med'>the smart, weather-enabled list app</h3> */}
            </div>
        </div>
      )

}

export default Header;



