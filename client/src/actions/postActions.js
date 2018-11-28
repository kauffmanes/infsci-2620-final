import axios from "axios";

import {
  GET_POSTS,
  GET_ERRORS,
  POSTS_LOADING
} from "./types";

// populate feed
export const populateFeed = (queryParams={}) => (
  async(dispatch) => {
    dispatch({ type: POSTS_LOADING });    
    try {
      const questions = await axios.get("/api/questions", queryParams);
      dispatch({
        type: GET_POSTS,
        payload: questions
      });
    } catch (err) {
      dispatch({
        type: GET_ERRORS
      });
    }
  }
);
