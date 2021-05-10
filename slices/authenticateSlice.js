import { createSlice } from "@reduxjs/toolkit";
import { axios } from "../config";

const initialState = {
  isSignedIn: null,
  userId: null,
  authErr: null,
};

export const authenticateSlice = createSlice({
  name: "authenticate",
  initialState,
  reducers: {
    SIGN_IN: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based on those changes
      state.isSignedIn = true;
      state.userId = action.payload;
      state.authErr = null;
    },
    SIGN_OUT: (state) => {
      (state.isSignedIn = false), (state.userId = null), (state.authErr = null);
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    AUTH_ERR: (state, action) => {
      state.authErr = action.payload;
    },
  },
});

export const { SIGN_IN, SIGN_OUT, AUTH_ERR } = authenticateSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

export const authenticateUser = (email, password) => async (dispatch) => {
  const { data } = await axios.post("/login", {
    email,
    password,
  });

  if (data.message.toLowerCase().includes("success")) {
    dispatch(SIGN_IN(data.userInfo));
  } else {
    dispatch(AUTH_ERR(data.message));
  }
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state) => state.counter.value;

export default authenticateSlice.reducer;
