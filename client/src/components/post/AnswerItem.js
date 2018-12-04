import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import { deleteAnswer } from "../../actions/postActions";

class AnswerItem extends Component {
  onDeleteClick(postId, answerId) {
    //this.props.deleteAnswer(postId, answerId);
  }

  render() {
    const { answer, postId, auth } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              {/*<img
                className="rounded-circle d-none d-md-block"
                src={answer.avatar}
                alt=""
              />*/}
            </a>
            <br />
            {answer.author != null ? (
              <p className="text-center">{answer.author.firstName}</p>
            ) : null}
          </div>
          <div className="col-md-10">
            <p className="lead">{answer.content}</p>
            {answer.author._id === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, postId, answer._id)}
                type="button"
                className="btn btn-danger mr-1"
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

AnswerItem.propTypes = {
  // deleteAnswer: PropTypes.func.isRequired,
  answer: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  author: PropTypes.string
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
  //{ deleteAnswer }
)(AnswerItem);
