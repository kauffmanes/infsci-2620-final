import React, { Component } from "react";
import PropTypes from "prop-types";
import AnswerItem from "./AnswerItem";

class AnswerFeed extends Component {
  render() {
    const { answers, postId } = this.props;
    if (answers != null) {
      return answers.map(answer => (
        <AnswerItem key={answer._id} answer={answer} postId={postId} />
      ));
    } else {
      return null;
    }
  }
}

AnswerFeed.propTypes = {
  answers: PropTypes.array,
  postId: PropTypes.string.isRequired
};

AnswerFeed.defaultProps = {
  answers: []
};

export default AnswerFeed;
