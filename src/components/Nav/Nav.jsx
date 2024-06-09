import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);
  console.log(user);
  
  return (
    <div className="nav">
      <div>{!user.id && (
          <Link className="navLink" to="/login">Login / Register</Link>)}
        {user.id && (
          <>
            <Link className="navLink" to="/home" >Home</Link>
            <Link className="navLink" to="/lists/0">My Lists</Link>
            <Link className="navLink" to="/about">About</Link>
            <LogOutButton className="navLink" />
          </>
        )}
        <Link className="navLink" to="/welcome">Welcome</Link>
      </div>
      <p className="username sm-font">USER <span className="med-font">{user.username}</span></p>
    </div>
  );
}

export default Nav;
