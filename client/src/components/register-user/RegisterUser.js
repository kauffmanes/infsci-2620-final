import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import CheckBoxGroup from "../common/CheckboxGroup";
import TermsandConditions from "../eula/TermsandConditions";
import Recaptcha from "react-recaptcha";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      employer: "",
      displayName: "",
      title: "",
      password: "",
      password2: "",
      tandc: false,
      isVerified: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
    this.verifyRecaptcha = this.verifyRecaptcha.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    if (e.target.type !== "checkbox") {
      this.setState({ [e.target.name]: e.target.value });
    } else {
      this.setState({ tandc: !this.state.tandc });
    }
  }

  recaptchaLoaded() {
    console.log("Recaptcha loaded");
  }
  verifyRecaptcha(response) {
    if (response) {
      this.setState({ isVerified: true });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      employer: this.state.employer,
      displayName: this.state.displayName,
      title: this.state.title,
      password: this.state.password,
      password2: this.state.password2,
      tandc: this.state.tandc
    };
    if (this.state.isVerified) {
      this.props.registerUser(newUser, this.props.history);
    } else {
      alert("Please confirm you are human");
    }

    /**/
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h1>Terms and Conditions</h1>

                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <TermsandConditions />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your HealthShare account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="First Name"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onChange}
                  error={errors.firstName}
                />
                <TextFieldGroup
                  placeholder="Last Name"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.onChange}
                  error={errors.lastName}
                />
                <TextFieldGroup
                  placeholder="Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
                <TextFieldGroup
                  placeholder="Employer"
                  name="employer"
                  value={this.state.employer}
                  onChange={this.onChange}
                  error={errors.employer}
                />
                <TextFieldGroup
                  placeholder="Handle"
                  name="displayName"
                  value={this.state.displayName}
                  onChange={this.onChange}
                  error={errors.displayName}
                />
                <TextFieldGroup
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  type="password"
                  name="password2"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <CheckBoxGroup
                  type="checkbox"
                  name="tandc"
                  label="I accept the Terms and Conditions"
                  onChange={this.onChange}
                  error={errors.tandc}
                />
                <Recaptcha
                  sitekey="6Lcz9oEUAAAAAJ7rwL2lxUweazn7Enpoxq8tjnwr"
                  render="explicit"
                  verifyCallback={this.verifyRecaptcha}
                  onloadCallback={this.recaptchaLoaded}
                />
                <input
                  type="submit"
                  className="btn btn-info btn-block mt-4"
                  value="Sign Up"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
