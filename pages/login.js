import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { authenticateUser } from "../actions";
import { axios } from "../config";
import { SIGN_IN, AUTH_ERR } from "../actions/types";

export function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logInError, setLogInError] = useState("");

  const router = useRouter();

  //Show authentication error or send to profile is logged in
  useEffect(() => {
    if (props.authErr) {
      setLogInError(props.authErr);
    }

    if (props.userId) {
      router.push("/profile");
    }
  }, [props.authErr, props.userId]);

  //Authenticate user on submitting credentials
  const authSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post("/login", {
      email,
      password,
    });

    if (data.message.toLowerCase().includes("success")) {
      props.authenticateUser(SIGN_IN, data.userInfo);
    } else {
      props.authenticateUser(AUTH_ERR, data.message);
    }
  };

  return (
    <div className="relative inline-block md:w-1/4  px-2  mt-[3rem]">
      <form onSubmit={authSubmit} className="flex flex-col">
        <div className="flex justify-between">
          <label htmlFor="email" className="">
            Email address
          </label>
          <input
            className="border-2"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="flex justify-between">
          <label htmlfor="password" className="t">
            Password
          </label>
          <input
            className="border-2"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <p>{logInError}</p>
        <button
          type="submit"
          className="bg-blue-300 w-2/4 md mt-[1rem] self-end hover:bg-blue-400 px-8 py-2 rounded-md focus:outline-none focus:ring focus-border-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    authErr: state.auth.authErr,
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps, { authenticateUser })(Login);
