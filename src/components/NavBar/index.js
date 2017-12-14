import React, { Component } from 'react';
import { IndexLink } from 'react-router'
import logo from './images/main-logo.png';
import './NavBar.scss';

class App extends Component {
  render() {
    return (
      <nav id="mainNav">
        <div className="header">
          <IndexLink to="/"><img src={logo} alt="logo" /></IndexLink>
        </div>
        <a href="#" className="disconnect">Déconnexion</a>
      </nav>
    );
  }
}

export default App;
