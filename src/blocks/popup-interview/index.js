import React, { Component } from 'react';
import './styles.scss';

class PopUpInterview extends Component {
  render() {
    var _this = this;
    var hasContents = function(){
      var contents = {__html: _this.props.interview.popin};
      return(
        <div dangerouslySetInnerHTML={contents}></div>
      )
    }
    return (
      <div id={"card-interview-" + this.props.interview.date} className="card-popup mfp-hide">
        <article className="interview">
          <h2 className="title">
            <span>L'interview <strong>#MyDailyStyle</strong> <br/>de <a href={this.props.interview.url} target="_blank">{this.props.interview.name}</a></span>
          </h2>
          <div className="contents">
            {hasContents()}
          </div>
        </article>
      </div>
    );
  }
};

export default PopUpInterview;
