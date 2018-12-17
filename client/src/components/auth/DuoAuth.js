import React, { Component } from "react";
import Duo from "./Duo-Web-v2";
import axios from 'axios';
export default class DuoAuth extends Component {
  constructor() {
    super();
    const sig_request = localStorage.getItem("sig_request");
    Duo.init({
      host: "api-341e8179.duosecurity.com",
      sig_request: localStorage.getItem("sig_request"),
      submit_callback: (data) => {
        
        const sig_response = data.getElementsByTagName('input')[0].value;

        axios.post('/api/users/duo', {
          sig_response
        }).then(res => {
          console.log(res);
          // do something
        }).catch(err => {
          console.log(err)
        })
      }
    });
  }
  render() {
    return (
      <div>
        <iframe id="duo_iframe" />
      </div>
    );
  }
}
