import { SET_LOCAL_STREAM } from '../constants/ActionTypes';

const initialState = [{
  src: null
}];

export default function webchat(state = initialState, action) {
  switch (action.type) {
  case SET_LOCAL_STREAM:
    return {src: URL.createObjectURL(action.src)}

  default:
    return state;
  }
}
