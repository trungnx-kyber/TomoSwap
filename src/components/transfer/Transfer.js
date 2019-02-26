import React, { Component } from 'react';
import TransferView from './TransferView';
import { connect } from 'react-redux';

function mapStateToProps(store) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {}
}

class Transfer extends Component {


  render() {
    return (
      <TransferView/>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
