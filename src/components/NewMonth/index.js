import React, { Component } from 'react';
import './styles.scss';
import { IndexLink } from 'react-router';

import MonthForm from '../../blocks/month-form';

class NewMonth extends Component {
  constructor(){
    super();
    this.state = {}
  }

  componentDidMount() {
    var _this = this;
  }

  render() {
    var _this = this;
    
    return (
      <div className="NewMonth">
        <IndexLink to="/" className="backLink">Retour</IndexLink>
        <h1 className="title text-center less-margins">Ajouter un mois</h1>
        <MonthForm />
      </div>
    );
  }
}

export default NewMonth;
