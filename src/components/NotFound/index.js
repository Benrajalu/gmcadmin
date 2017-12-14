import React, { Component } from 'react';
import classnames from 'classnames';

import './NotFound.css';

class App extends Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('NotFound', className)} {...props}>
        <h1>No, this is not found</h1>
      </div>
    );
  }
}

export default App;
