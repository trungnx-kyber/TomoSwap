import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccountView from "./ImportAccountView";
import * as accountActions from '../../actions/accountAction';

function mapStateToProps(store) {
  return {
    address: store.account.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
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

      fileReader.onload = () => {
        const keystore = JSON.parse(fileReader.result);

        if (!keystore.address || !keystore.Crypto) {
          return "You have chosen an invalid Keystore file";
        }

        const address = '0x' + keystore.address;

        this.props.importAccount(address);
      };

      fileReader.readAsBinaryString(keystoreFile)
    } catch (e) {
      console.log(e)
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
        connectToMetamask={this.props.connectToMetamask}
        connectToKeystore={this.connectToKeystore}
        openKeystoreFileSelection={this.openKeystoreFileSelection}
        disconnectFromWallet={this.props.disconnectFromWallet}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
