import React, { Component } from 'react';
import InputGroup from '../commons/InputGroup';

export default class TransferView extends Component {
  render() {
    const disabledClass = !!this.props.error ? 'disabled' : '';

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
            <div className={"input-group__title"}>To Address:</div>
            <div className={`input-group__wrapper`}>
              <input className={"input-group__input input-group__input--full"} type="text"/>
            </div>
            <div className={"input-group__info"}/>
          </div>
        </div>

        <div className={"exchange__button-container common__fade-in"}>
          <div className={`exchange__button common__button-gradient ${disabledClass}`} onClick={() => this.props.transfer()}>Transfer Now</div>
        </div>
      </div>
    )
  }
}
