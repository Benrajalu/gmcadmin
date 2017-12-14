import React, { Component } from 'react';
import './styles.scss';

class PopUpSingle extends Component {
  constructor() {
    super();
    this.state = {
      contents: {__html: ''}
    }
  }

  render() {
    var _this = this, 
        date = _this.props.date.replace('/', '-');

    var hasContents = function(){
      var contents = {__html: _this.props.contents.copy};
      return(
        <div dangerouslySetInnerHTML={contents}></div>
      )
    }

    var products = this.props.contents.products.map(function(product, index){
      var cleanProduct = {__html: product};
      return(
        <li key={index} dangerouslySetInnerHTML={cleanProduct}></li>
      )
    });

    var image;
    if(this.props.contents.image.split(":")[0] === "data"){
      image = <img src={this.props.contents.image} alt="" />
    }
    else{
      image = <img src={process.env.PUBLIC_URL + "/images/" + this.props.contents.image} alt="" />
    }

    return (
      <div id={"card-" + date + "-16"} className="card-popup mfp-hide">
        <div className="image single">
          <figure>
            {image}
          </figure>
          <div className="contents">
            <p className="date">{this.props.date}</p>
            {hasContents()}
            <ul className="listing">
             {products}
            </ul>
            <div className="button-wrapper">
              <a href={this.props.contents.url} data-date={ date + "-16"} className="button shop" target="_blank">Je shoppe ! <i className="cart"></i></a>
            </div>
          </div>
        </div>
      </div> 
    );
  }
};

export default PopUpSingle;
