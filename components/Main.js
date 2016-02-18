import React, { Component, PropTypes } from 'react';
import { SOME_ACTION } from '../constants/ActionTypes';

export default class Main extends Component {
  static propTypes = {
    webchat: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  constructor() {
    super()
  }

  render() {
    return (
      <div>Main componentSome</div>
    );
  }
}
