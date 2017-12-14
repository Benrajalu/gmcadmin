import React, { Component } from 'react';
import { Link } from 'react-router';
import MonthList from '../../blocks/MonthList';

import './Home.scss';

class App extends Component {
  render() {
    return (
      <div className="Home">
        <div className="text-center">
          <Link className="btn" to="/new-month/">Ajouter un mois</Link>
        </div>
        <div id="currentMonths">
          <h1 className="title text-center">Contenu disponible</h1>
        </div>
        <MonthList />
      </div>
    );
  }
}

export default App;
