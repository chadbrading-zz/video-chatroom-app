import React, { Component, PropTypes } from 'react';
import Client from './Client';

export default class Main extends Component {
  static propTypes = {
    webchat: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.webchat.channel.join()
      .receive('ok', (client_count) => {console.log(client_count); this.props.actions.establishPeerConnections(client_count)})
      .receive('error', (client_count) => {console.log('Unable to join the call channel')})
  }
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        {this.props.webchat.clients.map(client => {
          return <Client channel={this.props.webchat.channel} stream={client.stream} setLocalStream={this.props.actions.setLocalStream} gotRemoteStream={this.props.actions.gotRemoteStream} />
        })}
      </div>
    )
  }
}
