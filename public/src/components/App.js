import React from 'react';
import { Component } from 'react';

export default class App extends Component {
	componentWillMount() {
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
