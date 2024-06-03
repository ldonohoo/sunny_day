import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../Header/Header.css';

function Header() {
  const user = useSelector((store) => store.user);

  return (
        <div className="header">
            <div className="text-backing"></div>
            <div className="happy-cloud-box">
                <Link className="header-link" to="/home" >
                    <h2 className="header-title">Sunny Day</h2>
                    <h3 className='header-tagline med-lg-font font-weight-med'>the smart, weather-enabled list app</h3>
                </Link>
            </div>
        </div>
      )

}

export default Header;