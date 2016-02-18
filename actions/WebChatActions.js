import * as types from '../constants/ActionTypes';

export function setLocalStream(src) {
  return {
    type: types.SET_LOCAL_STREAM,
    src: src
  }
}
