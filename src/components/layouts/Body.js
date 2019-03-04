import React, { Component } from 'react';
import { connect } from "react-redux";
import Market from '../market/Market';
import Swap from '../swap/Swap';
import Transfer from '../transfer/Transfer';
import ImportAccount from '../account/ImportAccount';
import * as globalActions from "../../actions/globalAction";
import AppConfig from "../../config/app";
import Modal from "../../components/commons/Modal";

function mapStateToProps(store) {
  const global = store.global;

  return {
    exchangeMode: global.exchangeMode,
    globalError: global.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setExchangeMode: (exchangeMode) => {dispatch(globalActions.setExchangeMode(exchangeMode))},
    resetGlobalError: () => {dispatch(globalActions.setGlobalError())},
  }
}

class Body extends Component {
  render() {
    const isSwapMode = this.props.exchangeMode === AppConfig.EXCHANGE_SWAP_MODE;

    return (
      <div className={"body"}>
        <div className={"container"}>
          <div className={"body__container"}>
            <div className={"body__content"}>
              <h3 className={"body__title"}>Etiam eu enim pretium acinia metus auctor lectus</h3>
              <p className={"body__subtitle"}>Lorem ipsum dolor sit amet piscing elit. In facilisis sollicitudin ultricies.</p>
            </div>
            <div className={"body__content"}>
              <div className={"body__exchange"}>
                <div className={"body__exchange-wrapper"}>
                  <div className={`body__exchange-content body__exchange-content--${isSwapMode ? AppConfig.EXCHANGE_SWAP_MODE : AppConfig.EXCHANGE_TRANSFER_MODE}`}>
                    <div className={`body__exchange-button ${isSwapMode ? 'body__exchange-button--active' : ''}`} onClick={() => this.props.setExchangeMode(AppConfig.EXCHANGE_SWAP_MODE)}>Swap</div>
                    <div className={`body__exchange-button ${!isSwapMode ? 'body__exchange-button--active' : ''}`} onClick={() => this.props.setExchangeMode(AppConfig.EXCHANGE_TRANSFER_MODE)}>Transfer</div>
                  </div>
                </div>
                {isSwapMode && (
                  <Swap/>
                )}
                {!isSwapMode && (
                  <Transfer/>
                )}
                <ImportAccount/>
              </div>
            </div>
          </div>
          <Market/>
        </div>
        <Modal isActive={!!this.props.globalError} handleClose={() => this.props.resetGlobalError()}>
          <div className={"modal__header modal__header--error"}>Error!</div>
          <div className={"modal__body"}>
            <div className={"modal__body-top"}>{this.props.globalError}</div>
          </div>
          <div className={"modal__footer common__flexbox common__flexbox--center"}>
            <div className={"modal__button modal__button--gradient"} onClick={() => this.props.resetGlobalError()}>Try Again</div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);
