import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import * as swapActions from "../../actions/swapAction";
import { filterInputNumber } from "../../utils/validators";

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
    tx: swap.tx,
    error: swap.error,
    isAccountImported: !!account.account,
    isBalanceLoading: account.isBalanceLoading,
    isConfirmLoading: account.isConfirmLoading,
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
  constructor(props) {
    super(props);

    this.state = {
      isSwapBalanceBoxActive: false
    }
  }

  componentDidMount = () => {
    this.props.fetchTokenPairRate();
  };

  handleClickSwapButton = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a swap");
      return;
    }
  };

  handleSourceAmountChange = (e) => {
    const isValueValid = filterInputNumber(e, e.target.value, this.props.sourceAmount);

    if (!isValueValid) return;

    this.props.setSourceAmount(e.target.value);
  };

  handleOpenSwapBalanceBox = () => {
    this.setState({ isSwapBalanceBoxActive: true });
  };

  handleCloseSwapBalanceBox = () => {
    this.setState({ isSwapBalanceBoxActive: false })
  };

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    const srcTokenBalance = this.props.sourceToken.balance;
    const sourceAmountByPercentage = (srcTokenBalance * (balancePercentage / 100)).toFixed(this.props.sourceToken.decimals);

    this.props.setSourceAmount(sourceAmountByPercentage);
    this.handleCloseSwapBalanceBox();
  };

  render() {
    return (
      <SwapView
        handleClickSwapButton={this.handleClickSwapButton}
        handleSelectSourceToken={this.props.setSourceToken}
        handleSelectDestToken={this.props.setDestToken}
        handleSourceAmountChange={this.handleSourceAmountChange}
        handleOpenSwapBalanceBox={this.handleOpenSwapBalanceBox}
        handleCloseSwapBalanceBox={this.handleCloseSwapBalanceBox}
        addSrcAmountByBalancePercentage={this.addSrcAmountByBalancePercentage}
        tx={this.props.tx}
        sourceToken={this.props.sourceToken}
        destToken={this.props.destToken}
        sourceAmount={this.props.sourceAmount}
        destAmount={this.props.destAmount}
        tokens={this.props.tokens}
        tokenPairRate={this.props.tokenPairRate}
        error={this.props.error}
        isSwapBalanceBoxActive={this.state.isSwapBalanceBoxActive}
        isAccountImported={this.props.isAccountImported}
        isTokenPairRateLoading={this.props.isTokenPairRateLoading}
        isBalanceLoading={this.props.isBalanceLoading}
        isConfirmLoading={this.props.isConfirmLoading}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
