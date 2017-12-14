import React, { Component } from 'react';
import Toggle from '../../blocks/Toggle';
import { Link } from 'react-router';
import './styles.scss';

var jQuery = require('jquery');
var $ = jQuery;
require('magnific-popup');

class CardContest extends Component {
  constructor() {
    super();
    this.state = {
      cleanDate: "", 
      dotation: {__html: ''}
    }
  }

  // Re-draws the grid when the image is loaded
  handleImageLoaded() {
    this.props.iso.reloadItems();
    this.props.iso.arrange();
  }

  componentDidMount() {
    var date = this.props.card.date;
    this.setState({
      cleanDate : date.replace('/', '-'), 
      dotation : {__html: this.props.card.dotation}
    })

    var popLink = this.refs.popLink;
    $(popLink).magnificPopup({
      type:'inline',
      midClick: true,
      removalDelay: 300,
      mainClass: 'mfp-fade',
      callbacks:{
        open:function(){
          setTimeout(function(){
            $('.look-slider').data('flexslider').resize();
          }, 150);
        }
      }
    });
  }

  // Handle toggles feedbacks here
  handleStatusChange(target){
    console.log(target);
  }

  render() {
    return (
      <div className="card" data-id={this.props.card.rank}>
        <div className="admin-control">
          <Toggle onStatusChange={this.handleStatusChange} id={this.props.month} day={'-' + this.props.card.date.replace('/', '-')} status={this.props.card.status} date={this.props.month} />
          <Link className="edit-link" to={"/edit/contest/" + this.props.month}>Edit</Link>
        </div>
        <div className="card-contents contest">    
          <div className="copy">
            <h2>Jeu concours</h2>
            <h3>Tentez votre chance <br/>au grand jeu C&amp;A Cosmo</h3>
            <div dangerouslySetInnerHTML={this.state.dotation}></div>
            <a href={"#card-contest-" + this.state.cleanDate + "-16"} ref="popLink" className="button pink pop-trigger">Je participe <i className="arrow"></i></a>
          </div>
          <figure className="image">
            <img src={process.env.PUBLIC_URL + "/images/" + this.props.card.image} alt="" onLoad={this.handleImageLoaded.bind(this)} />
          </figure>
        </div>
      </div>
    );
  }
};

export default CardContest;
