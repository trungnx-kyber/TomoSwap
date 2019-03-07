import React, { Component } from 'react';
import TokenSelector from '../commons/TokenSelector';
import { formatAmount } from "../../utils/helpers";
import InputGroup from '../commons/InputGroup';

export default class SwapView extends Component {
  render() {
    const disabledClass = (!!this.props.error || this.props.isTokenPairRateLoading) ? 'disabled' : '';

    return (
      <div className={"exchange"}>
        <div className={"exchange__container"}>
          <InputGroup
            tokens={this.props.tokens}
            sourceToken={this.props.sourceToken}
            sourceAmount={this.props.sourceAmount}
            setSourceToken={this.props.setSourceToken}
            setSourceAmount={this.props.setSourceAmount}
            isAccountImported={this.props.isAccountImported}
            isBalanceLoading={this.props.isBalanceLoading}
            error={this.props.error}
          />

          <div className={"input-group"}>
            <div className={"input-group__title"}>To:</div>
            <div className={`input-group__wrapper`}>
              <TokenSelector
                selectedToken={this.props.destToken}
                onSelectToken={this.props.setDestToken}
                tokens={this.props.tokens}
              />
              <div className={"input-group__input"}>
                {this.props.sourceAmount ? this.props.isDestAmountLoadingShown ? 'Loading...' : formatAmount(this.props.destAmount) : 0}
              </div>
            </div>

            <div className={"input-group__info"}>
              1 {this.props.sourceToken.symbol} = {!this.props.isTokenPairRateLoading ?
              formatAmount(this.props.tokenPairRate) :
              <div className={"input-group__loading common__loading"}/>} {this.props.destToken.symbol}
            </div>
          </div>
        </div>

        <div className={"exchange__button-container common__fade-in"}>
          <div className={`exchange__button common__button-gradient ${disabledClass}`} onClick={() => this.props.swap()}>Swap Now</div>
        </div>
      </div>
    )
  }
}
