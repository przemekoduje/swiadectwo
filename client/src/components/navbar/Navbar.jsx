import React from 'react'
import './navbar.scss';
import MenuIcon from '@mui/icons-material/Menu';


export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <div className='navbar'>
        <div className="logoArea">
          {/* <div className="logo">
            <img src="/images/logo.png" alt="" />
          </div> */}
          <div className="logoText">
          <span>swiadectwo-na-klik.online</span>
        </div>
        </div>
        <div className="linkArea">
          <a href="/">Q & A</a>
          <a href="/">Twoje konto</a>
          <button>Zróbmy to</button>
        </div>
        <div className="hamburger">
          <MenuIcon />
        </div>
      </div>
    </div>

  )
}
