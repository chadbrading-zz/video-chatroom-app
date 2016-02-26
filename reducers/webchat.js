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
  stream: null,
  clients: {}
}

function initializeClients(client_count) {
  let clients = {}
  for (var i = 1; i < client_count; i++) {
    clients[i] = {id: i, peerConnection: new RTCPeerConnection(servers)}
  }
  console.log('peerConnections created')
  return clients
}

function addLocalStreamToClients(state, stream) {
  var clients = Object.keys(state.clients).map((key) => state.clients[key])
  var newClients = {}
  for (var client of clients) {
    client.peerConnection.onicecandidate = (event) => {gotLocalIceCandidate(state.id, state.channel, event)}
    client.peerConnection.addStream(stream)
    console.log('local stream added')
    newClients[client.id] = client
  }
  return newClients
}

function configurePeerConnection(peerConnection, state) {
  peerConnection.addStream(state.stream)
  peerConnection.onicecandidate = (event) => {gotLocalIceCandidate(state.id, state.channel, event)}
  peerConnection.createOffer((description) => {gotLocalDescription(description, peerConnection, state.id, state.channel)}, handleError)
  return peerConnection
}

function gotLocalIceCandidate(localClientId, channel, event) {
  if (event.candidate) {
    console.log("Local ICE candidate: \n" + event.candidate.candidate)
    channel.push("message", {body: JSON.stringify({
      'candidate': event.candidate,
      'id': localClientId})
    })
  }
}

function gotLocalDescription(description, peerConnection, localClientId, channel) {
  peerConnection.setLocalDescription(description, () => {
    channel.push("message", { body: JSON.stringify({
      'sdp': peerConnection.localDescription,
      'id': localClientId
    })});
  }, handleError);
  console.log("Offer from localPeerConnection: \n" + description.sdp);
  return peerConnection
}

function gotRemoteDescription(state, description) {
  console.log("Answer from remotePeerConnection: \n" + description.sdp);
  var client = state.clients[description.id]
  var peerConnection = client.peerConnection
  peerConnection.setRemoteDescription(new RTCSessionDescription(description.sdp))
  if (description.sdp.type === "offer") {
    peerConnection.createAnswer((description) => {gotLocalDescription(description, peerConnection, state.id, state.channel)}, handleError)
  }
  return peerConnection
}

function gotRemoteIceCandidate(clients, event) {
  console.log("Remote ICE candidate: \n " + event.candidate.candidate)
  var client = clients[event.id]
  var peerConnection = client.peerConnection
  peerConnection.addIceCandidate(new RTCIceCandidate(event.candidate))
  return peerConnection
}

function handleError(error) {
  console.log(`Error: ${error}`)
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
      stream: action.stream,
      clients: addLocalStreamToClients(state, action.stream)
    })

  case constants.GOT_REMOTE_STREAM:
    console.log('got remote stream')
    var newClients = Object.assign({}, state.clients)
    newClients[action.client.id].stream = action.event.stream
    return Object.assign({}, state, {clients: newClients})

  case constants.ADD_CLIENT:
    var newClients = Object.assign({}, state.clients)
    var peerConnection = configurePeerConnection(new RTCPeerConnection(servers), state)
    newClients[action.client_id] = {id: action.client_id, peerConnection: peerConnection}
    return Object.assign({}, state, {clients: newClients})

  case constants.GOT_REMOTE_DESCRIPTION:
    var newClients = Object.assign({}, state.clients)
    var peerConnection = gotRemoteDescription(state, action.description)
    newClients[action.description.id].peerConnection = peerConnection
    return Object.assign({}, state, {clients: newClients})

  case constants.GOT_REMOTE_ICE_CANDIDATE:
    var newClients = Object.assign({}, state.clients)
    var peerConnection = gotRemoteIceCandidate(state.clients, action.event)
    newClients[action.event.id].peerConnection = peerConnection
    return Object.assign({}, state, {clients: newClients})

  case constants.SAVE_PEER_CONNECTION:
    var newClients = Object.assign({}, state.clients)
    newClients[action.client.id] = action.client
    return Object.assign({}, state, {clients: newClients})

  default:
    return state;
  }
}

// const initialState = {
//   channel: channel,
//   id: null,
//   stream: null,
//   clients:
//     {
//       1: {
//       id: null,
//       peerConnection: null,
//       stream: null
//       }
//     }
// }
//
