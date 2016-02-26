import React, { Component } from 'react';
import Video from './Video';

export default class LocalClient extends Component {
  componentDidMount() {
    navigator.getUserMedia({audio: true, video: true}, this.props.setLocalStream, error => {
      console.log("getUserMedia error: ", error)
    })
  }
  render() {
    return (
      <Video stream={URL.createObjectURL(this.props.stream)} />
    )
  }
}

