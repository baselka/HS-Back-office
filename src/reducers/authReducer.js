import { AUTHENTICATE, DEAUTHENTICATE } from "../actions/types";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  token: null
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state,
        ...action.payload,
      };
    case AUTHENTICATE:
      return {
        ...state,
        token: action.payload
      };
    case DEAUTHENTICATE:
      return {
        token: null
      };
    default:
      return state;
  }
};

export default authReducer;
