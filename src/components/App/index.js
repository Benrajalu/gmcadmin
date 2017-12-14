import React, { Component } from 'react';
import NavBar from '../NavBar';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <div id="mainContent"> 
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
