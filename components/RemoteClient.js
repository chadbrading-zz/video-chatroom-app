import React, { Component } from 'react';
import Video from './Video';

export default class RemoteClient extends Component {
  componentDidMount() {
    this.configurePeerConnection()
  }
  configurePeerConnection() {
    var _this = this
    this.props.client.peerConnection.onaddstream = (event) => {_this.props.gotRemoteStream(this.props.client, event)}
    this.props.savePeerConnection(this.props.client)
  }
  render() {
    return (
      <Video stream={URL.createObjectURL(this.props.client.stream)} />
    )
  }
}
