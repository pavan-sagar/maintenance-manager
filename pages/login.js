import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import serverPath  from '../serverPath'

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logInError, setLogInError] = useState("");

  const router = useRouter();

  const authSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('http://localhost:3001/login', {
      email,
      password,
    },{withCredentials:true});



    // if (response.data.message.toLowerCase().includes("success")) {
    //   router.push("/profile");
    // } else {
    //   setLogInError(response.data.message);
    // }
  };

  return (
    <div className="relative inline-block md:w-1/4  px-2  mt-[3rem]">
      <form
        onSubmit={authSubmit}
        // method="post"
        // action="/api/login"
        className="flex flex-col"
      >
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
