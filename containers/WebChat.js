import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Connector } from 'react-redux';
import Main from '../components/Main';
import * as WebChatActions from '../actions/WebChatActions';

export default class WebChat extends Component {
  render() {
    return (
      <Connector select={state => ({ webchat: state.webchat })}>
        {this.renderChild}
      </Connector>
    );
  }

  renderChild({ webchat, dispatch }) {
    const actions = bindActionCreators(WebChatActions, dispatch);
    return (
      <div>
        <Main webchat={webchat} actions={actions} />
      </div>
    );
  }
}
