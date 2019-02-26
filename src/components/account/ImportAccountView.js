import React, { Component } from 'react';

export default class ImportAccountView extends Component {
  render() {
    return (
      <div className={"account__container common__fade-in"}>
        <div className={"account__title"}>Connect with</div>
        <div className={"account"}>
          <div className={"account__item"}>
            <div className={"account__icon account__icon--metamask"}/>
            <div className={"account__name"}>Metamask</div>
          </div>
          <div className={"account__item"}>
            <div className={"account__icon account__icon--ledger"}/>
            <div className={"account__name"}>Ledger</div>
          </div>
          <div className={"account__item"}>
            <div className={"account__icon account__icon--trezor"}/>
            <div className={"account__name"}>Trezor</div>
          </div>
          <div className={"account__item"}>
            <div className={"account__icon account__icon--keystore"}/>
            <div className={"account__name"}>Keystore</div>
          </div>
          <div className={"account__item"}>
            <div className={"account__icon account__icon--privatekey"}/>
            <div className={"account__name"}>Private Key</div>
          </div>
        </div>
      </div>
    )
  }
}
