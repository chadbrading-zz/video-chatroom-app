import React, { Component, PropTypes } from 'react';
import { SOME_ACTION } from '../constants/ActionTypes';
import Client from './Client';

export default class Main extends Component {
  static propTypes = {
    webchat: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Client src={this.props.webchat.src} setLocalStream={this.props.actions.setLocalStream} />
    );
  }
}
