import React, { Component } from 'react';
import { connect } from "react-redux";
import { setTxHash } from "../../actions/transactionAction";
import { setExchangeMode } from "../../actions/globalAction";
import TransactionView from "./TransactionView";

function mapStateToProps(store) {
  const tx = store.tx;

  return {
    exchangeMode: store.global.exchangeMode,
    isTxModalOpened: !!tx.txHash,
    txHash: tx.txHash,
    isTxMined: tx.isTxMined,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    unsetTxHash: () => { dispatch(setTxHash()) },
    setExchangeMode: (exchangeMode) => { dispatch(setExchangeMode(exchangeMode)) },
  }
}

class Transaction extends Component {
  handleSetExchangeMode = (exchangeMode) => {
    this.props.unsetTxHash();
    this.props.setExchangeMode(exchangeMode);
  };

  render() {
    return (
      <TransactionView
        txHash={this.props.txHash}
        isTxMined={this.props.isTxMined}
        isTxModalOpened={this.props.isTxModalOpened}
        exchangeMode={this.props.exchangeMode}
        unsetTxHash={this.props.unsetTxHash}
        handleSetExchangeMode={this.handleSetExchangeMode}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
