import * as constants from '../constants/ActionTypes';
import * as actions from '../actions/WebChatActions'
import {Socket} from '../phoenix';

const socket = new Socket('ws://localhost:4000/socket')
socket.connect()
const channel = socket.channel('call', {})
//Decrease client count upon closing channel

const servers = {
  'iceServers': [{
    'url': 'stun:stun.example.org'
  }]
}

const initialState = {
  channel: channel,
  id: null,
  clients: []
}

function initializeClients(client_count) {
    let clients = []
    clients.push({id: client_count, connection: null})
    for (var i = 1; i < client_count; i++) {
      clients.push({id: i, peerConnection: new RTCPeerConnection(servers)})
    }
    return clients
}

function configurePeerConnections(clients, stream) {
  return clients.map(function(client) {
    if (client.peerConnection) {
      client.peerConnection.addStream(stream)
      client.peerConnection.onicecandidate = gotLocalIceCandidate
      client.peerConnection.onaddstream = actions.gotRemoteStream
    } else {
      client.stream = URL.createObjectURL(stream)
    }
    return client
  })
}

function gotLocalIceCandidate() {
  if (event.candidate) {
    console.log("Local ICE candidate: \n" + event.candidate.candidate)
    this.props.channel.push("message", {body: JSON.stringify({
          'candidate': event.candidate
          })})
  }
}

export default function webchat(state = initialState, action) {
  switch (action.type) {
  case constants.ESTABLISH_PEER_CONNECTIONS:
    return Object.assign({}, state, {
      id: action.client_count,
      clients: initializeClients(action.client_count)
    })

  case constants.SET_LOCAL_STREAM:
    return Object.assign({}, state, {
      stream: URL.createObjectURL(action.stream),
      clients: configurePeerConnections(state.clients, action.stream)
    })

  case constants.GOT_REMOTE_STREAM:
    return Object.assign({}, state, {
    })
    // return Object.assign({}, state, {
    //   clients: [
    //     ...state.clients.slice(0, -1),
    //     Object.assign({}, state.clients.slice(-1)[0], {
    //       stream: URL.createObjectURL(action.stream)
    //     })
    //   ]
    // })
  default:
    return state;
  }
}

// const initialState = {
//   channel: channel,
//   id: null,
//   clients: [
//     {
//       id: null,
//       peerConnection: null,
//       stream: null
//     }
//   ]
// }
