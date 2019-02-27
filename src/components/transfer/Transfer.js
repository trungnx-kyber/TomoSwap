import React, { Component } from 'react';
import TransferView from './TransferView';
import { connect } from 'react-redux';
import * as transferAction from "../../actions/transferAction";

function mapStateToProps(store) {
  const tokens = store.token.tokens;
  const account = store.account;
  const transfer = store.transfer;

  return {
    tokens: tokens,
    sourceToken: transfer.sourceToken,
    sourceAmount: transfer.sourceAmount,
    toAddress: transfer.toAddress,
    error: transfer.error,
    isAccountImported: !!account.account,
    isBalanceLoading: account.isBalanceLoading,
    isConfirmLoading: account.isConfirmLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSourceToken: (token) => {dispatch(transferAction.setSourceToken(token))},
    setSourceAmount: (amount) => {dispatch(transferAction.setSourceAmount(amount))},
    setToAddress: (address) => {dispatch(transferAction.setToAddress(address))},
    setError: (message) => {dispatch(transferAction.setError(message))},
  }
}

class Transfer extends Component {
  transfer = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a transfer");
    }
  };

  render() {
    return (
      <TransferView
        tokens={this.props.tokens}
        toAddress={this.props.toAddress}
        sourceToken={this.props.sourceToken}
        sourceAmount={this.props.sourceAmount}
        setSourceToken={this.props.setSourceToken}
        setSourceAmount={this.props.setSourceAmount}
        setToAddress={this.props.setToAddress}
        transfer={this.transfer}
        isAccountImported={this.props.isAccountImported}
        isBalanceLoading={this.props.isBalanceLoading}
        isConfirmLoading={this.props.isConfirmLoading}
        error={this.props.error}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
