import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { deleteQuestion, flagQuestion } from "../../actions/postActions";
import placeholder from "../../assets/placeholder.jpg";
import flag from "../../assets/flag.svg"; // Icons made by www.flaticon.com
import FlagsContent from './FlagsContent';

class PostItem extends Component {
  onDeleteClick(id) {
    this.props.deleteQuestion(id);
  }

  onFlagQuestion(id, flagId, ) {
    this.props.flagQuestion(id, flagId, this.props.history);
  }
  render() {
    const { post, auth, showActions, flags } = this.props;
    
    return (
      <>
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
                <h1>Why do you want to flag this question?</h1>
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
                <FlagsContent flags={flags} id={post._id} flagPost={(id, flagId) => this.onFlagQuestion(id, flagId) } />
              </div>
            </div>
          </div>
        </div>
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-2">
              <a href="profile.html">
                <img
                  className="rounded-circle d-none d-md-block"
                  src={placeholder}
                  alt="profile avatar"
                />
              </a>
              <br />
              {post.author ? (
                <p className="text-center">
                  {post.author.firstName} {post.author.lastName}
                </p>
              ) : null}
            </div>
            <div className="col-md-10">
              <h4>{post.title}</h4>
              <p className="lead">{post.content}</p>
              {showActions ? (
                <span>
                  <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                    View Answers
                  </Link>
                  {post.author && post.author._id === auth.user.id ? (
                    <button
                      onClick={this.onDeleteClick.bind(this, post._id)}
                      type="button"
                      className="btn btn-danger mr-1"
                    >
                      <i className="fas fa-times" />
                    </button>
                  ) : null}
                </span>
              ) : null}
            </div>
          </div>
          <a href="/" data-toggle="modal" id={post._id} data-target="#exampleModal" className="flag"><img src={flag} alt="an orange flag used to flag an innapropriate question" /></a>
        </div>
      </>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteQuestion, flagQuestion }
)(PostItem);
