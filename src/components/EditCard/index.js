import React, { Component } from 'react';
var axios = require('axios');
import './Month.scss';
import { Link } from 'react-router';

import MonthForm from '../../blocks/month-form';
import CardForm from '../../blocks/card-form';

class EditCard extends Component {
  constructor(){
    super();
    this.state = {
      currentMonth: {
        id : "preview",
        fullDate : "preview",
        guest : "",
        interview : {
          portrait: "preview/portrait.png",
          date : "preview",
          name : "",
          intro:"<p>Preview du texte d'introduction</p>",
          logo : 'preview/logo.png',
          url : "",
          popin : "<p><strong>Exemple de question</strong></p><p>Exemple de réponse</p>"
        }
      },
      currentStatus: 'offline', 
      monthId: ''
    }
  }

  componentDidMount() {
    var _this = this;
    if(_this.props.params.type === "month"){
      axios.get("../../data/data.json").then(function(result) {
        function isRightMonth(month){
          return month.id === _this.props.params.id
        }
        var filtered = result.data.months.filter(isRightMonth);    
        _this.setState({
          currentMonth: filtered[0]
        });
      });
    }
    else if(_this.props.params.type === "card"){
      axios.get("../../data/data.json").then(function(result) {
        var id = _this.props.params.id.split('-'), 
            targetMonth = id[1] + "-" + id[2], 
            targetCard = id[0] + "/" + id[1];

        function isRightMonth(month){
          return month.id === targetMonth
        }
        function isRightCard(card){
          return card.date === targetCard
        }
        var currentMonth = result.data.months.filter(isRightMonth);    
        var currentCard = currentMonth[0].cards.filter(isRightCard);
        _this.setState({
          currentMonth: currentMonth[0], 
          currentCard: currentCard[0]
        });
        console.log(_this.state);
      });
    }
  }

  // When child component report an update to a month, I deal with it here
  handleStatusChange(target){
    console.log(target);
  }


  render() {
    var _this = this;

    var display = function(){
      if(_this.props.params.type === "month"){
        return(
          <div className="singleMonth">
            <Link to={"/month/" + _this.props.params.id} className="backLink">Retour</Link>
            <h1 className="title text-center less-margins">Modifier ce mois</h1>
            <MonthForm contents={_this.state.currentMonth} monthId={_this.props.params.id} actionType="edit" />
          </div>
        )
      }
      else if(_this.props.params.type === "card"){
        return(
          <div className="singleMonth">
            <Link to={"/month/" + _this.state.currentMonth.id} className="backLink">Retour</Link>
            <h1 className="title text-center less-margins">Modifier cette carte</h1>
            <CardForm contents={_this.state.currentCard} month={_this.state.currentMonth} actionType="edit" />
          </div>
        )
      }
    }
    
    return (
      <div>
        {display()}
      </div>
    );
  }
}

export default EditCard;
