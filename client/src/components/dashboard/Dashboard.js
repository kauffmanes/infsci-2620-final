import React, { Component } from "react";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
//import { getCurrentProfile } from "../../actions/authActions";

export default class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              <div>
                <p className="lead text-muted">Welcome {user.name}</p>
                <p>You have not yet setup a profile, please add some info</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
