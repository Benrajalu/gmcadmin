import React, { Component } from 'react';
var axios = require('axios');
import './Month.scss';
import { IndexLink, Link } from 'react-router';
import CardsList from '../../blocks/CardsList';
import Toggle from '../../blocks/Toggle';

class SingleMonth extends Component {
  constructor(){
    super();
    this.state = {
      currentMonth:[], 
      currentStatus: 'offline', 
      monthId: ''
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
        monthId: filtered[0].id
      });
    });
  }

  // When child component report an update to a month, I deal with it here
  handleStatusChange(target){
    console.log(target);
  }


  render() {
    var _this = this;
    var displayCurrentMonth = _this.state.currentMonth.map(function(month) {
      return (
        <div key={month.id}>
          <h1 className="title text-center less-margins">
            {month.fullDate}
            <Toggle onStatusChange={_this.handleStatusChange} id={_this.state.monthId} status={_this.state.currentStatus} date={month.date} />
          </h1>
          <div className="text-center">
            <Link to={"/new-card/" + _this.state.monthId} className="btn">Ajouter une carte</Link>
          </div>
          <CardsList month={_this.state.currentMonth} />
        </div>
      );
    });
    
    return (
      <div className="singleMonth">
        <IndexLink to="/" className="backLink">Retour</IndexLink>
        {displayCurrentMonth}
      </div>
    );
  }
}

export default SingleMonth;
