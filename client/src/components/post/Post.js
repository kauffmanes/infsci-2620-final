import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import PostItem from "../feed/PostItem";
import AnswerForm from "./AnswerForm";
import AnswerFeed from "./AnswerFeed";
import Spinner from "../common/Spinner";
import { getQuestion } from "../../actions/postActions";

class Post extends Component {
  componentDidMount() {
    this.props.getQuestion(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;
    let postContent;
    console.log(post);
    //console.log(this.props.match.params.id);
    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = (
        //<div>jbkjsa</div>
        <div>
          <PostItem post={post} showActions={false} />
          <AnswerForm postId={post._id} />
          <AnswerFeed postId={post._id} answers={post.answers} />
        </div>
      );
    }

    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back To Feed
              </Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  getQuestion: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getQuestion }
)(Post);
