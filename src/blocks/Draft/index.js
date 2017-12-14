import React, { Component, PropTypes } from 'react';
//import ReactDOM from 'react-dom';
import RichTextEditor from 'react-rte';

import './styles.scss';

class Draft extends Component {
  constructor() {
    super();
    this.state = {
      value: RichTextEditor.createEmptyValue(), 
      cleanValue : '',
      edited: false
    };
  }

  static propTypes = {
    onChange: PropTypes.func
  };

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  onChange = (value) => {
    console.log("change");
    this.setState({
      value, 
      edited: true
    });
    if (this.props.onChange) {
      this.props.onChange(
        value.toString('html')
      );
      this.setState({
       cleanValue: value.toString('html')
      });
    }
  };

  componentDidMount() {
    if(this.props.default){
      this.setState({
        value: RichTextEditor.createValueFromString(this.props.default, 'html')
      })
    }
  }

  componentWillReceiveProps(nextProps){
    // This is in place so the base value of a RTE can be updated once a parent component AJAX finally gets through
    // It isn't great though as it can only work once - it disabled one of its passing conditions on execution
    if(nextProps.default !== this.props.default && this.state.edited === false){
      this.setState({
        value: RichTextEditor.createValueFromString(nextProps.default, 'html'), 
        edited: true
      })
    }
  }

  render() {
    var _this = this;
    var toolbarConfig;
    if(_this.props.button === "standards"){
      toolbarConfig = {
        // Optionally specify the groups to display (displayed in the order listed).
        display: ['INLINE_STYLE_BUTTONS','HISTORY_BUTTONS', 'LINK_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
          {label: 'Bold', style: 'BOLD', className: 'bold'}
        ]
      } 
    }
    else{
      toolbarConfig = {
        display: ['INLINE_STYLE_BUTTONS','BLOCK_TYPE_DROPDOWN','HISTORY_BUTTONS', 'LINK_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
          {label: 'Bold', style: 'BOLD', className: 'bold'}
        ],
        BLOCK_TYPE_DROPDOWN: [
          {label: 'Normal', style: 'unstyled'},
          {label: 'Heading Small', style: 'header-three', className: 'title'}
        ]
      } 
    }
    return (
      <div>
        <RichTextEditor
          value={this.state.value}
          onChange={this.onChange}
          toolbarConfig={toolbarConfig}
        />
      </div>
    )
  }
};

export default Draft;
