import React, { Component } from "react";
import Duo from "./Duo-Web-v2";
import axios from "axios";
import { login2FA } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class DuoAuth extends Component {
  componentDidMount() {
    Duo.init({
      host: "api-341e8179.duosecurity.com",
      sig_request: localStorage.getItem("sig_request"),
      submit_callback: data => {
        const sig_response = data.getElementsByTagName("input")[0].value;

        axios
          .post("/api/users/duo", {
            sig_response
          })
          .then(res => {
            this.props.login2FA();
            this.props.history.push("/feed");
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }

  render() {
    return (
      <div>
        <iframe id="duo_iframe" title="duo_iframe" />
      </div>
    );
  }
}

DuoAuth.propTypes = {
  login2FA: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { login2FA }
)(DuoAuth);
