import React, { Component } from "react";
import Duo from "./Duo-Web-v2";

export default class DuoAuth extends Component {
  constructor() {
    super();
    console.log(localStorage.getItem("sig_request"));
    Duo.init({
      host: "api-341e8179.duosecurity.com",
      sig_request: localStorage.getItem("sig_request"),
      post_action: "/api/users/duo"
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
