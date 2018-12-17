import React, { Component } from "react";
import { connect } from "react-redux";
import { populateFeed, populateFlags } from "../../actions/postActions";
import Spinner from "../common/Spinner";
import PostFeed from "./PostFeed";
import PostForm from "./PostForm";
class Feed extends Component {
  componentDidMount() {
    this.props.populateFeed();
    this.props.populateFlags();
  }

  render() {
    const { posts, loading, flagsLoading, flags } = this.props.posts;
    let feedContent;

    if (posts === null || loading || flagsLoading || flags === null) {
      feedContent = <Spinner />;
    } else {
      feedContent = <PostFeed posts={posts} flags={flags} />;
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PostForm />
              {feedContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.post
});

export default connect(
  mapStateToProps,
  {
    populateFeed,
    populateFlags
  }
)(Feed);
