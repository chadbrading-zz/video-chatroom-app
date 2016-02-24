import React, { Component } from 'react';

export default class Video extends Component {
  render() {
    return (
      <video autoPlay muted src={this.props.stream}></video>
    )
  }
}
