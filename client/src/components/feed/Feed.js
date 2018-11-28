import React, { Component } from "react";
import { connect } from "react-redux";
import { populateFeed } from "../../actions/postActions";
import Spinner from "../common/Spinner";

class Feed extends Component {
  componentDidMount() {
    this.props.populateFeed();
  }
  
  render() {
    const { posts, loading } = this.props.posts;
    let feedContent;

    if (posts === null || loading) {
      feedContent = <Spinner />;
    } else {
      feedContent = (
        <>{JSON.stringify(posts.data)}</>
      );
    }

    return (
      <div className="feed">
          <div className="container">
            <div className="row">
              <div className="col-md-12">{feedContent}</div>
            </div>
          </div>
        </div>
    );
  }
};

const mapStateToProps = state => ({
  posts: state.post
});

export default connect(mapStateToProps, {
  populateFeed
})(Feed);
