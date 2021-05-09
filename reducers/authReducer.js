import { SIGN_IN, SIGN_OUT, AUTH_ERR } from "../actions/types";

const authInitialState = {
  isSignedIn: null,
  userId: null,
  authErr: null,
};

const authReducer = (state = authInitialState, action) => {
  console.log(action)
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload,
        authErr: null,
      };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, userId: null };

    case AUTH_ERR:
      return { ...state, authErr: action.payload };

    default:
      return state;
  }
};

export default authReducer;
