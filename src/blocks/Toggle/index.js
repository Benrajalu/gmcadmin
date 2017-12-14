import React, { Component } from 'react';
import './styles.scss';

class Toggle extends Component {
  constructor() {
    super();
    this.state = {
      date: '', 
      status: "offline",
      monthId: '', 
      dayId: ''
    }
  }

  componentDidMount() {
    this.setState({
      status: this.props.status, 
      date: this.props.date,
      monthId: this.props.id, 
      dayId: this.props.day
    })
  }

  changeToggle(e) {
    var monthId = this.state.monthId;
    var newValue, dayId;

    if(this.state.dayId){
      dayId = this.state.dayId.substring(1);
    }

    if(this.state.status === "online"){
      newValue = 'offline';
      this.setState({
        status: "offline"
      });
    }
    else{
      newValue = 'online';
      this.setState({
        status: "online"
      });
    }

    console.log("Here I should try to update the JSON month entry where the id is " + monthId + " with the new status of " + newValue);
    this.props.onStatusChange({id: monthId, status: newValue, day: dayId});
  }

  render() {
    return (
      <div className="toggle">
        <input type="checkbox" id={'online-' + this.state.monthId + this.state.dayId} value={this.state.status}  />
        <label htmlFor={'online-' + this.state.monthId + this.state.dayId} onClick={this.changeToggle.bind(this)}>En ligne</label>
      </div>
    );
  }
};

export default Toggle;
