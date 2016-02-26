import * as types from '../constants/ActionTypes';

export function setLocalStream(stream) {
  return {
    type: types.SET_LOCAL_STREAM,
    stream: stream
  }
}

export function gotRemoteStream(client, event) {
  return {
    type: types.GOT_REMOTE_STREAM,
    client: client,
    event: event
  }
}

export function establishPeerConnections(client_count) {
  return {
    type: types.ESTABLISH_PEER_CONNECTIONS,
    client_count: client_count
  }
}

export function configureChannel() {
  return {
    type: types.CONFIGURE_CHANNEL
  }
}

export function addClient(client_id) {
  return {
    type: types.ADD_CLIENT,
    client_id: client_id
  }
}

export function gotRemoteDescription(description) {
  return {
    type: types.GOT_REMOTE_DESCRIPTION,
    description: description
  }
}

export function gotRemoteIceCandidate(event) {
  return {
    type: types.GOT_REMOTE_ICE_CANDIDATE,
    event: event
  }
}

export function savePeerConnection(client) {
  return {
    type: types.SAVE_PEER_CONNECTION,
    client: client
  }
}
