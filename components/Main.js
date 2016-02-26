import React, { Component, PropTypes } from 'react';
import LocalClient from './LocalClient';
import RemoteClient from './RemoteClient';

export default class Main extends Component {
  static propTypes = {
    webchat: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.webchat.channel.join()
      .receive('ok', (client_count) => {
        console.log('channel joined')
        this.props.actions.establishPeerConnections(client_count)
        this.configureChannel()
      })
      .receive('error', (client_count) => {console.log('Unable to join the call channel')})
  }
  configureChannel() {
    var props = this.props
    props.webchat.channel.on("message", payload => {
      let message = JSON.parse(payload.body)
      console.log(message, (new Date()).toLocaleTimeString())
      if (message.id !== props.webchat.id) {
        if (message.sdp) {
          props.actions.gotRemoteDescription(message)
        } else if (message.candidate) {
          props.actions.gotRemoteIceCandidate(message)
        } else {
          props.actions.addClient(message.id)
        }
      }
    })
    console.log('channel configured')
  }
  constructor(props) {
    super(props)
  }
  render() {
    var _this = this
    var remoteClients = Object.keys(this.props.webchat.clients).map((key) => { return this.props.webchat.clients[key]})
    if (remoteClients.length > 0) {
      remoteClients = remoteClients.map(client => {
        return <RemoteClient client={client} channel={_this.props.webchat.channel} gotRemoteStream={_this.props.actions.gotRemoteStream} savePeerConnection={_this.props.actions.savePeerConnection} />
      })
    }
    return (
      <div>
        <LocalClient stream={this.props.webchat.stream} setLocalStream={this.props.actions.setLocalStream} />
        {remoteClients}
      </div>
    )
  }
}
