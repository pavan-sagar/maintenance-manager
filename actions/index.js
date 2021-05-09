import { SIGN_IN, SIGN_OUT, AUTH_ERR } from "./types";
import { axios } from "../config";

export const authenticateUser = (type, payload) => {
  console.log(type,payload)
  return {
    type:type,
    payload:payload,
  };
};

//Sample async action dispatch

// export const createStream = (formValues) => async (dispatch, getState) => {
//   const { userId } = getState().auth;

//   const response = await streams.post("/streams", { ...formValues, userId });

//   dispatch({
//     type: CREATE_STREAM,
//     payload: response.data,
//   });

//   //History object will programitically navigate to homepage once stream is created
//   history.push("/");
// };
