import React, { Component } from 'react';
import Video from './Video';

export default class Client extends Component {
  componentDidMount() {
    navigator.getUserMedia({audio: true, video: true}, this.props.setLocalStream, error => {
      console.log("getUserMedia error: ", error)
    })
  }
  render() {
    return (
      <Video src={this.props.src} />
    )
  }
}

