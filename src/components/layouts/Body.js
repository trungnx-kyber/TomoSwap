import React, { Component } from 'react';
import Market from '../market/Market';
import Swap from '../swap/Swap';

class Body extends Component {
  render() {
    return (
      <div className={"body"}>
        <div className={"container"}>
          <div className={"body__container"}>
            <div className={"body__content"}>
              <h3 className={"body__title"}>Etiam eu enim pretium acinia metus auctor lectus</h3>
              <p className={"body__subtitle"}>Lorem ipsum dolor sit amet piscing elit. In facilisis sollicitudin ultricies.</p>
            </div>
            <div className={"body__content"}><Swap/></div>
          </div>
          <Market/>
        </div>
      </div>
    )
  }
}

export default Body;
