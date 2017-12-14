import React, { Component } from 'react';
var axios = require('axios');
import './styles.scss';

import MonthBlock from '../MonthBlock';
//var jsonData = require('../../data/data.json');


// This is the MonthList app, parent component to month blocks. 
class MonthList extends Component {
  constructor() {
    super();
    this.state = {
      entries: []
    }
  }

  // When the component mounts, I retrieve the JSON from the server
  componentDidMount() {
    var _this = this;
    axios.get("../data/data.json").then(function(result) {    
      _this.setState({
        entries: result.data.months.reverse()
      });
    });
  }

  // When child component report an update to a month, I deal with it here
  handleStatusChange(target){
    console.log(target);
  }

  render() {
    var _this = this;
    var monthNodes = this.state.entries.map(function(month) {
      if(month.filled){
        return (
          <MonthBlock onStatusChange={_this.handleStatusChange} key={month.id} url={month.id} monthId={month.id} monthName={month.fullDate} guest={month.guest} status={month.status} cards={month.cards}/>
        );
      }
      else{
        return false;
      }
    });
    return (
      <div className="month-list">
        {monthNodes}
      </div>
    );
  }
};

export default MonthList;