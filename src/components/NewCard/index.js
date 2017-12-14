import React, { Component } from 'react';
var axios = require('axios');
import './styles.scss';
import { Link } from 'react-router';

import CardForm from '../../blocks/card-form';

class NewCard extends Component {
  constructor(){
    super();
    this.state = {
      currentMonth:[], 
      currentStatus: 'offline', 
      monthId: '', 
      month:{}
    }
  }

  componentDidMount() {
    var _this = this;
    axios.get("../data/data.json").then(function(result) {
      function isRightMonth(month){
        return month.id === _this.props.params.id
      }
      var filtered = result.data.months.filter(isRightMonth);    
      _this.setState({
        currentMonth: filtered, 
        currentStatus: filtered[0].status, 
        monthId: filtered[0].id,
        month: filtered[0],
      });
    });
  }

  render() {
    var _this = this;
    
    return (
      <div className="NewCard">
        <Link to={"/month/" + this.state.monthId} className="backLink">Retour</Link>
        <h1 className="title text-center less-margins">{_this.state.month.fullDate} - Ajouter une carte</h1>
        <CardForm month={this.state.monthId} />
      </div>
    );
  }
}

export default NewCard;
