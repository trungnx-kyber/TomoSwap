import React, { Component } from 'react';
import TokenSelector from '../commons/TokenSelector';
import PasswordInput from '../commons/PasswordInput';
import { formatAmount } from "../../utils/helpers";
import InputGroup from '../commons/InputGroup';
import Modal from "../../components/commons/Modal";
import { TOMO } from "../../config/tokens";
import appConfig from "../../config/app";

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
          <div className={`exchange__button common__button-gradient ${disabledClass}`} onClick={() => this.props.openSwapConfirmModal()}>Swap Now</div>
        </div>

        <Modal isActive={this.props.isSwapConfirmModalOpened} handleClose={() => this.props.closeSwapConfirmModal()}>
          <div className={"exchange__modal"}>
            <div className={"modal__header"}>Confirm Swap</div>
            <div className={"modal__body exchange__modal-body"}>
              <div className={"modal__body-top common__flexbox exchange__modal-number"}>
                <div className={"exchange__modal-number-text"}>{formatAmount(this.props.sourceAmount)} {this.props.sourceToken.symbol}</div>
                <div className={"exchange__modal-number-icon"}/>
                <div className={"exchange__modal-number-text"}>{formatAmount(this.props.destAmount)} {this.props.destToken.symbol}</div>
              </div>
              <div className={"modal__body-bot"}>
                <div>
                  <div className={"exchange__modal-text"}>1 {this.props.sourceToken.symbol} = {formatAmount(this.props.tokenPairRate)} {this.props.destToken.symbol}</div>
                  <div className={"exchange__modal-gas"}>GAS fee: * {TOMO.symbol}</div>
                </div>

                {this.props.walletType === appConfig.WALLET_TYPE_KEYSTORE && (
                  <PasswordInput/>
                )}
              </div>
            </div>
            <div className={"modal__footer common__flexbox"}>
              <div className={"modal__button"} onClick={() => this.props.closeSwapConfirmModal()}>Cancel</div>
              <div className={"modal__button modal__button--gradient"} onClick={() => this.props.handleSwapToken()}>Confirm</div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
