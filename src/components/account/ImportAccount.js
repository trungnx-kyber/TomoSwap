import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccountView from "./ImportAccountView";

function mapStateToProps(store) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {}
}

class ImportAccount extends Component {
  render() {
    return (
      <ImportAccountView/>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
