import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";

class PostFeed extends Component {
  render() {
    const { posts } = this.props;
    if (posts.data != null) {
      return posts.data.map(post => <PostItem key={post._id} post={post} />);
    } else {
      return null;
    }
  }
}

PostFeed.propTypes = {
  posts: PropTypes.object.isRequired
};

export default PostFeed;
