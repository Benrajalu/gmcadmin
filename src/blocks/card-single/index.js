import React, { Component } from 'react';
import Toggle from '../../blocks/Toggle';
import { Link } from 'react-router';
import './styles.scss';

var jQuery = require('jquery');
var $ = jQuery;
require('magnific-popup');

class CardSingle extends Component {
  constructor() {
    super();
    this.state = {
      date: '', 
      status: "offline",
      id: '', 
      hasContents: '',
      contents: {__html: ''}
    }
  }

  // Re-draws the grid when the image is loaded
  handleImageLoaded() {
    if(this.props.iso){
      this.props.iso.reloadItems();
      this.props.iso.arrange();
    }
  }

  componentDidMount() {
    var date = this.props.card.date;
    this.setState({
      status: this.props.card.status, 
      date: date.replace('/', '-'),
      id: this.props.card.id
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
    var _this = this;
    var hasContents = function(){
      if(_this.props.card.copy && _this.props.card.copy !== "<p><br></p>"){
        var contents = {__html: _this.props.card.copy};
        return(
          <div dangerouslySetInnerHTML={contents}></div>
        )
      }
      else{
        return false
      }
    }
    var controls = function(){
      if(!_this.props.preview){
        return(
          <div className="admin-control">
            <Toggle onStatusChange={_this.handleStatusChange} id={_this.props.month} day={'-' + _this.props.card.date.replace('/', '-')} status={_this.props.card.status} date={_this.props.month} />
            <Link className="edit-link" to={"/edit/card/" + _this.state.date + "-" + _this.props.month.split('-')[1]}>Edit</Link>
          </div>
        )
      }
    }
    var cardImage = function(){
      if(!_this.props.previewImage){
        return(
          <img src={process.env.PUBLIC_URL + "/images/" + _this.props.card.image} onLoad={_this.handleImageLoaded.bind(_this)} alt="" />
        )
      }
      else{
        return(
          <img src={_this.props.card.image} alt="" />
        )
      }
    }

    var isWhite = '';
    if(this.props.card.white){
      isWhite = "white";
    }

    return (
      <div className="card" data-id={this.props.card.rank} ref="card">
        {controls()}
        <div className={"card-contents " + (hasContents() ? "with-copy" : false)}>
          <figure className="image">
            <p className={"date " + isWhite}>{this.props.card.date}</p>
            {hasContents()}
            {cardImage()}
          </figure>
          <a href={"#card-" + this.state.date +"-16"} ref="popLink" className="button read-more pop-trigger">En savoir plus <i className="plus-icon"></i></a>
        </div>
      </div>
    );
  }
};

export default CardSingle;
