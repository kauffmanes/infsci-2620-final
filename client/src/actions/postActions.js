import axios from "axios";

import {
  GET_ERRORS,
  GET_POSTS,
  POSTS_LOADING,
  ADD_POST,
  CLEAR_ERRORS,
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  DELETE_ANSWER,
  GET_FLAGS,
  FLAGS_LOADING,
  FLAG_QUESTION
} from "./types";

// populate feed
export const populateFeed = (queryParams = {}) => async dispatch => {
  dispatch({ type: POSTS_LOADING });
  try {
    const questions = await axios.get("/api/questions", queryParams);
    dispatch({
      type: GET_POSTS,
      payload: questions
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: null
    });
  }
};

// fetch all of the available flags
export const populateFlags = () => async dispatch => {
  dispatch({ type: FLAGS_LOADING });
  try {
    const flags = await axios.get('/api/flags');
    dispatch({
      type: GET_FLAGS,
      payload: flags
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: null
    });
  }
}

//add Question
export const addQuestion = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/questions", postData)
    .then(res => {
      //console.log(res);
      dispatch({
        type: ADD_POST,
        payload: res
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Answer
export const addAnswer = answerData => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/answers`, answerData)
    .then(res => {
      console.log(res);
      dispatch({
        type: GET_POST,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Get Question by Id
export const getQuestion = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/questions/id/${id}`)
    .then(
      res =>
        dispatch({
          type: GET_POST,
          payload: res.data
        })
      //console.log(res.data)
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

// Delete Question
export const deleteQuestion = id => dispatch => {
  axios
    .delete(`/api/questions/id/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

export const flagQuestion = (questionId, flagId, history) => async dispatch => {
  axios.put(`/api/questions/id/${questionId}/flag/${flagId}`).then(res => {
    console.log(res);
    if (window.location.href.indexOf('feed') < 0) {
      history.push('/feed');
    }
    dispatch({
      type: FLAG_QUESTION,
      payload: questionId
    });
  }).catch(err => console.log(err));
};

// Delete Answer
export const deleteAnswer = id => dispatch => {
  axios
    .delete(`/api/answers/id/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_ANSWER,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// Set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
