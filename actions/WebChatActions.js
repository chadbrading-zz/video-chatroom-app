import * as types from '../constants/ActionTypes';

export function setLocalStream(stream) {
  return {
    type: types.SET_LOCAL_STREAM,
    stream: stream
  }
}

export function gotRemoteStream(stream) {
  return {
    type: types.GOT_REMOTE_STREAMd,
    stream: stream
  }
}

export function establishPeerConnections(client_count) {
  return {
    type: types.ESTABLISH_PEER_CONNECTIONS,
    client_count: client_count
  }
}
