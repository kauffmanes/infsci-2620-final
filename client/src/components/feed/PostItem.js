import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import classnames from "classnames";
import { Link } from "react-router-dom";
import { deleteQuestion, addLike, removeLike } from "../../actions/postActions";

class PostItem extends Component {
  onDeleteClick(id) {
    //console.log(id);
    this.props.deleteQuestion(id);
  }
  /*
  onLikeClick(id) {
    this.props.addLike(id);
  }

  onUnlikeClick(id) {
    this.props.removeLike(id);
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }*/

  render() {
    const { post, auth, showActions } = this.props;
    //console.log(post);
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              {/*<img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />*/}
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
                {/*<button
                  onClick={this.onLikeClick.bind(this, post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": this.findUserLike(post.likes)
                    })}
                  />
                  <span className="badge badge-light">{post.likes.length}</span>
                  </button>*/}
                {/*<button
                  onClick={this.onUnlikeClick.bind(this, post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                </button>*/}
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
