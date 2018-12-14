import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { deleteQuestion } from "../../actions/postActions";
import placeholder from "../../assets/placeholder.jpg";

class PostItem extends Component {
  onDeleteClick(id) {
    this.props.deleteQuestion(id);
  }

  render() {
    const { post, auth, showActions } = this.props;

    return (
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
      </div>
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
  { deleteQuestion }
)(PostItem);
