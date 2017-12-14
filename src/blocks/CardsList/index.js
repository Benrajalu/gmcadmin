import React, { Component } from 'react';
import './styles.scss';
import ReactDOM from 'react-dom';
var Isotope = require('isotope-layout');

import CardInterview from '../../blocks/card-interview';
import CardSingle from '../../blocks/card-single';
import CardContest from '../../blocks/card-contest';
import PopUpContest from '../../blocks/popup-contest';
import PopUpInterview from '../../blocks/popup-interview';
import PopUpTotal from '../../blocks/popup-total';
import PopUpSingle from '../../blocks/popup-single';
import PopUpSlider from '../../blocks/popup-slider';


// This is the MonthList app, parent component to month blocks. 
class CardsList extends Component {
  constructor() {
    super();
    this.state = {
      month: [], 
      iso: null
    }
  }

  componentDidMount() {
    var _this = this,
        grid = _this.refs.grid;

    _this.setState({
      month: _this.props.month,
      iso: new Isotope( ReactDOM.findDOMNode(grid), {
        // options... 
        layoutMode: 'masonry',
        itemSelector:'.card',
        percentPosition: true,
        getSortData: {
          id: '[data-id] parseInt', 
        },
        sortBy: 'id',
        sortAscending: false
      })
    });

    if(!_this.state.iso) {
      _this.setState({
        iso: new Isotope( ReactDOM.findDOMNode(grid), {
          // options... 
          layoutMode: 'masonry',
          itemSelector:'.card',
          percentPosition: true,
          getSortData: {
            id: '[data-id] parseInt', 
          },
          sortBy: 'id',
          sortAscending: false
        })
      });
    }
    else{
      _this.state.iso.reloadItems();
      _this.state.iso.arrange();
    }
  }

  componentDidUpdate(){
    if(this.state.iso){
      this.state.iso.reloadItems();
      this.state.iso.arrange();
    }
  }

  // When child component report an update to a month, I deal with it here
  handleStatusChange(target){
    console.log(target);
  }

  render() {
    var _this = this;
    var displayCards = _this.state.month.map(function(month) {
      var cards =  month.cards.reverse();
      var interviewCard = <CardInterview month={month} iso={_this.state.iso} />;
      var monthCards = cards.map(function(card) {
        if(card.type === 'image'){
          return(
            <CardSingle ref="card" iso={_this.state.iso} type={card.type}  status={card.status} month={month.id}  key={card.type + '-' + card.date} card={card} />
          )
        }
        else if (card.type === 'contest'){
          return(
            <CardContest ref="card" iso={_this.state.iso} type={card.type}  status={card.status} month={month.id} key={card.type + '-' + card.date} card={card} />
          )
        }
        else{
          return(
            <CardSingle ref="card" iso={_this.state.iso} type={card.type}  status={card.status} month={month.id} key={card.type + '-' + card.date} card={card} />
          )
        }
      });
      return ([
        interviewCard, 
        monthCards
      ]);
    });

    var displayPops = _this.state.month.map(function(month) {
      var interview = <PopUpInterview interview={month.interview} />;
      var monthPopups = month.cards.map(function(pop) {
        if(pop.type === 'contest'){
          return(
            <PopUpContest contents={pop} contestId={pop.formID} monthId={month.id} key={pop.type + '-' + pop.date.replace('/', '-')}/>
          )
        }
        else if(pop.popin.type === 'total'){
          return(
            <PopUpTotal contents={pop.popin} date={pop.date} key={pop.type + '-' + pop.date.replace('/', '-')}/>
          )
        }
        else if(pop.popin.type === 'single'){
          return(
            <PopUpSingle contents={pop.popin} date={pop.date} key={pop.type + '-' + pop.date.replace('/', '-')}/>
          )
        }
        else if(pop.popin.type === 'slider'){
          return(
            <PopUpSlider copy={pop.copy} contents={pop.popin} date={pop.date} key={pop.type + '-' + pop.date.replace('/', '-')}/>
          )
        }
        else{
          return false;
        }
      });

      return([
        interview, 
        monthPopups
      ])
    });

    return (
      <div ref="grid" className="card-list cards-wrapper">
        {displayCards}
        {displayPops}
      </div>
    )
  }
};

export default CardsList;