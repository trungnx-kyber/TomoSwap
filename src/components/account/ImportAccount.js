import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccountView from "./ImportAccountView";
import * as accountActions from '../../actions/accountAction';
import { setGlobalError } from '../../actions/globalAction';

function mapStateToProps(store) {
  return {
    address: store.account.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGlobalError: (error) => {dispatch(setGlobalError(error))},
    connectToMetamask: () => {dispatch(accountActions.connectToMetamask())},
    importAccount: (address) => {dispatch(accountActions.importAccount(address))},
    disconnectFromWallet: () => {dispatch(accountActions.setAddress())},
  }
}

class ImportAccount extends Component {
  constructor(props) {
    super(props);
    this.keystoreInputRef = React.createRef();
  }

  connectToKeystore = (e) => {
    try {
      const keystoreFile = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.readAsBinaryString(keystoreFile);

      this.importAccountFromKeystore(fileReader);
    } catch (e) {
      this.props.setGlobalError("There is something wrong with the chosen file");
    }
  };

  importAccountFromKeystore(fileReader) {
    fileReader.onload = () => {
      try {
        const keystore = JSON.parse(fileReader.result);

        if (!keystore.address || !keystore.Crypto) {
          this.props.setGlobalError("You have chosen an invalid Keystore file");
          return;
        }

        const address = '0x' + keystore.address;

        this.props.importAccount(address);
      } catch (e) {
        this.props.setGlobalError("You have chosen a malformed Keystore file");
      }
    };
  }

  openKeystoreFileSelection = () => {
    this.keystoreInputRef.current.click();
  };

  render() {
    return (
      <ImportAccountView
        address={this.props.address}
        keystoreInputRef={this.keystoreInputRef}
        connectToMetamask={this.props.connectToMetamask}
        connectToKeystore={this.connectToKeystore}
        openKeystoreFileSelection={this.openKeystoreFileSelection}
        disconnectFromWallet={this.props.disconnectFromWallet}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
