import React, { Component } from 'react';
import { Link } from 'react-router';
import Toggle from '../../blocks/Toggle';
import './styles.scss';

class MonthBlock extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  componentDidMount() {
    this.setState({
    })
  }

  CountOnlineCards() {
    function isOnline(card){
      return card.status === "online"
    }
    var filtered = this.props.cards.filter(isOnline);
    return filtered.length;
  }

  // When child component report an update to a month, I deal with it here
  handleStatusChange(target){
    console.log(target);
  }

  render() {
    return (
      <div className="month-block">
        <div className="point"></div>
        <div className="contents">
          <Link className="identification" to={"/month/" + this.props.url}>
            <h2 className="month">{this.props.monthName} - <span>{this.props.guest}</span></h2>
            <p><strong className="date">{this.props.monthId} -</strong> "Cartes" en ligne <strong>{this.CountOnlineCards()}/{this.props.cards.length}</strong></p>
          </Link>
          <div className="tools">
            <Toggle onStatusChange={this.handleStatusChange} id={this.props.monthId} status={this.props.status} date={this.props.monthId} />
          </div>
        </div>
      </div>
    );
  }
};

export default MonthBlock;
