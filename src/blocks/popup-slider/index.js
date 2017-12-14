import React, { Component } from 'react';
import './styles.scss';

var jQuery = require('jquery');
var $ = jQuery;
require('flexslider');

class PopUpSlider extends Component {
  constructor() {
    super();
    this.state = {
      contents: {__html: ''}
    }
  }

  componentDidMount() {
    var _this = this, 
        slider = this.refs.slider;

    $(slider).flexslider({
        'controlNav' : false,
        'slideshow' : false,
        'animation' : 'slide',
    })
  }

  componentDidUpdate(){
    console.log("yep");
    var _this = this, 
        slider = this.refs.slider;
    $(slider).removeData('flexslider');    
    $(slider).find('.flex-direction-nav, .clone').remove();
    $(slider).flexslider({
        'controlNav' : false,
        'slideshow' : false,
        'animation' : 'slide',
    });
  }

  render() {
    var _this = this, 
        date = _this.props.date.replace('/', '-');

    var introCopy = function(){
      var contents = {__html: _this.props.contents.copy};
      return(
        <div dangerouslySetInnerHTML={contents}></div>
      )
    }

    var products = this.props.contents.products.map(function(product, index){
      var cleanProduct = {__html: product.copy};
      var image;
      if(product.image.split(":")[0] === "data"){
        image = <img src={product.image} alt="" />
      }
      else{
        image = <img src={process.env.PUBLIC_URL + "/images/" + product.image} alt="" />
      }
      return(
        <li key={index}>
          <figure>
            {image}
            <figcaption>
              <h4 className="item-title">{ product.title }</h4>
              <div className="description">
                <div className="copy">
                  <p dangerouslySetInnerHTML={cleanProduct}></p>
                </div>
                <div className="price">
                  {product.price}
                </div>
              </div>
              <hr/>
              <div className="button-wrapper">
                <a href={product.url} data-date={ date + "-16" } className="button shop" target="_blank">Je shoppe ! <i className="cart"></i></a>
              </div>
            </figcaption>
          </figure>
        </li>
      )
    });

    return (
      <div id={"card-" + date + "-16"} className="card-popup mfp-hide">
        <div className="image slider">
          <div className="contents">
            {introCopy()}
          </div>
          <div className="flexslider look-slider" ref="slider">
            <ul className="slides">
              {products}
            </ul>
          </div>
        </div>
      </div> 
    );
  }
};

export default PopUpSlider;
