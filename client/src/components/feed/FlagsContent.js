import React, { Component } from 'react';
import {object, oneOfType, shape, arrayOf, func, string } from 'prop-types';

class FlagsContent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
      const { flags, id } = this.props;
      if (flags && flags.data) {
        return (
          flags.data.map(
            flag => <p key={flag._id}><a href="/" data-dismiss="modal" onClick={() => this.props.flagPost(id, flag._id)}>{flag.description}</a></p>
          )
        );
      } else {
        return null;
      }
    
  }
}

FlagsContent.propTypes = {
  flags: oneOfType([object, shape(), arrayOf(shape)]).isRequired,
  id: string.isRequired,
  flagPost: func.isRequired
};

export default FlagsContent;
