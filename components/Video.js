import React, { Component } from 'react';

export default class Video extends Component {
  render() {
    return (
      <video autoPlay src={this.props.src}></video>
    )
  }
}
