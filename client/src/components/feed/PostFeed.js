import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";
class PostFeed extends Component {
  render() {
    const { posts, flags  } = this.props;
    if (posts.data != null) {
      return posts.data.map(post => <PostItem key={post._id} post={post} flags={flags} />);
    } else {
      return null;
    }
  }
}

PostFeed.propTypes = {
  posts: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()]).isRequired
};

export default PostFeed;
