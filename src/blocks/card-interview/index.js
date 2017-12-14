import React, { Component } from 'react';
import { Link } from 'react-router';
import './styles.scss';

var jQuery = require('jquery');
var $ = jQuery;
require('magnific-popup');

class CardInterview extends Component {

  // Re-draws the grid when the image is loaded
  handleImageLoaded() {
    if(this.props.iso){
      this.props.iso.reloadItems();
      this.props.iso.arrange();
    }
  }

  componentDidMount() {
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

  render() {
    var _this = this;
    var hasContents = function(){
      var contents= false;
      if(_this.props.month.interview.intro){
        contents= {__html: _this.props.month.interview.intro};
        return(
          <div dangerouslySetInnerHTML={contents}></div>
        )
      }
    }
    
    var controls = function(){
      if(!_this.props.preview){
        return(
          <div className="admin-control right">
            <Link className="edit-link" to={"/edit/month/" + _this.props.month.interview.date }>Edit</Link>
          </div>
        )
      }
    }
    
    var previewPortrait = function(){
      if(_this.props.previewImages && _this.props.previewImages.portrait){
        return(
          <img src={_this.props.previewImages.portrait} alt="" />
        )
      }
      else{
        return(
          <img src={process.env.PUBLIC_URL + "/images/" + _this.props.month.interview.portrait} onLoad={_this.handleImageLoaded.bind(_this)} alt="" />
        )
      }
    }

    var previewLogo = function(){
      if(_this.props.previewImages && _this.props.previewImages.logo){
        return(
          <a href={_this.props.month.interview.url} target="_blank">
            <img src={_this.props.previewImages.logo} alt="" />
          </a>
        )
      }
      else{
        return(
          <a href={_this.props.month.interview.url} target="_blank">
            <img src={process.env.PUBLIC_URL + "/images/" + _this.props.month.interview.logo } onLoad={_this.handleImageLoaded.bind(_this)} alt="" />
          </a>
        )
      }
    }

    return (
      <div className="card" data-id="100">
        {controls()}
        <div className="card-contents controls-card">
          <div className="controls">
            <div className="portrait">
              {previewPortrait()}
            </div>
          </div>
          <div className="contents">
            {hasContents()}
            {previewLogo()}
            <a href={"#card-interview-" + this.props.month.interview.date} ref="popLink" className="button white pop-trigger">Lire l'interview <i className="arrow"></i></a>
          </div>
        </div>
      </div>
    );
  }
};

export default CardInterview;
