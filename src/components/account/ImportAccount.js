import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccountView from "./ImportAccountView";
import * as accountActions from '../../actions/accountAction';
import { setGlobalError } from '../../actions/globalAction';
import appConfig from '../../config/app';
import envConfig from "../../config/env";

function mapStateToProps(store) {
  return {
    address: store.account.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGlobalError: (error) => {dispatch(setGlobalError(error))},
    importAccount: (address, walletType) => {dispatch(accountActions.importAccount(address, walletType))},
    unsetAccount: () => {dispatch(accountActions.setWallet())},
  }
}

class ImportAccount extends Component {
  constructor(props) {
    super(props);
    this.keystoreInputRef = React.createRef();
  }

  connectToMetamask = async () => {
    if (!window.ethereum) {
      this.props.setGlobalError(`Cannot connect to Metamask. Please make sure you have Metamask installed`);
      return;
    } else if (+window.ethereum.networkVersion !== envConfig.NETWORK_ID) {
      this.props.setGlobalError(`Your Network ID should be ${envConfig.NETWORK_ID} that represents TomoChain Network`);
      return;
    }

    try {
      const accounts = await window.ethereum.enable();
      this.props.importAccount(accounts[0], appConfig.WALLET_TYPE_METAMASK);

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts[0]) {
          this.props.importAccount(accounts[0], appConfig.WALLET_TYPE_METAMASK);
        } else {
          this.props.unsetAccount();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  connectToKeystore = (e) => {
    try {
      const keystoreFile = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.readAsBinaryString(keystoreFile);

      fileReader.onload = () => {
        try {
          const keystore = JSON.parse(fileReader.result);

          if (!keystore.address || !keystore.Crypto) {
            this.props.setGlobalError("You have chosen an invalid Keystore file");
            return;
          }

          const address = '0x' + keystore.address;

          this.props.importAccount(address, appConfig.WALLET_TYPE_KEYSTORE);
        } catch (e) {
          this.props.setGlobalError("You have chosen a malformed Keystore file");
        }
      };
    } catch (e) {
      this.props.setGlobalError("There is something wrong with the chosen file");
    }
  };

  openKeystoreFileSelection = () => {
    this.keystoreInputRef.current.click();
  };

  render() {
    return (
      <ImportAccountView
        address={this.props.address}
        keystoreInputRef={this.keystoreInputRef}
        connectToMetamask={this.connectToMetamask}
        connectToKeystore={this.connectToKeystore}
        openKeystoreFileSelection={this.openKeystoreFileSelection}
        unsetAccount={this.props.unsetAccount}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
