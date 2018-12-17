import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  DELETE_POST,
  POST_LOADING,
  POSTS_LOADING,
  DELETE_ANSWER,
  FLAG_QUESTION,
  GET_FLAGS,
  FLAGS_LOADING
} from "../actions/types";

const initialState = {
  posts: [],
  post: {},
  loading: false,
  flagsLoading: false,
  flags: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case POSTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case FLAGS_LOADING:
      return {
        ...state,
        flagsLoading: true
      };
    case GET_FLAGS:
      return {
        ...state,
        flags: action.payload,
        flagsLoading: false
      };
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      };
    case ADD_POST:
      state.posts.data = [action.payload.data, ...state.posts.data];
      return {
        ...state
      };
    case FLAG_QUESTION:
      state.posts.data = state.posts.data.filter(
        post => post._id !== action.payload
      );
      return { ...state };
    case DELETE_POST:
      state.posts.data = state.posts.data.filter(
        post => post._id !== action.payload
      );
      return {
        ...state
      };
    case DELETE_ANSWER:
      state.post.answers = state.post.answers.filter(
        answer => answer._id !== action.payload
      );
      return {
        ...state
      };
    default:
      return state;
  }
}
