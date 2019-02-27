import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import * as swapActions from "../../actions/swapAction";

function mapStateToProps(store) {
  const token = store.token;
  const account = store.account;
  const swap = store.swap;
  const tokens = token.tokens;

  return {
    tokens: tokens,
    sourceToken: swap.sourceToken,
    destToken: swap.destToken,
    sourceAmount: swap.sourceAmount,
    destAmount: swap.destAmount,
    tokenPairRate: swap.tokenPairRate,
    isTokenPairRateLoading: swap.isTokenPairRateLoading,
    error: swap.error,
    isAccountImported: !!account.account,
    isBalanceLoading: account.isBalanceLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSourceToken: (token) => {dispatch(swapActions.setSourceToken(token))},
    setDestToken: (token) => {dispatch(swapActions.setDestToken(token))},
    setSourceAmount: (amount) => {dispatch(swapActions.setSourceAmount(amount))},
    fetchTokenPairRate: () => {dispatch(swapActions.fetchTokenPairRate())},
    swapToken: () => {dispatch(swapActions.swapToken())},
    setError: (message) => {dispatch(swapActions.setError(message))},
  }
}

class Swap extends Component {
  componentDidMount = () => {
    this.props.fetchTokenPairRate();
  };

  swap = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a swap");
    }
  };

  render() {
    return (
      <SwapView
        swap={this.swap}
        setSourceToken={this.props.setSourceToken}
        setSourceAmount={this.props.setSourceAmount}
        setDestToken={this.props.setDestToken}
        sourceToken={this.props.sourceToken}
        destToken={this.props.destToken}
        sourceAmount={this.props.sourceAmount}
        destAmount={this.props.destAmount}
        tokens={this.props.tokens}
        tokenPairRate={this.props.tokenPairRate}
        error={this.props.error}
        isAccountImported={this.props.isAccountImported}
        isTokenPairRateLoading={this.props.isTokenPairRateLoading}
        isBalanceLoading={this.props.isBalanceLoading}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
