import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { authenticateUser } from "../slices/authenticateSlice";
import { axios } from "../config";

export function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/signin");

      if (data.message.toLowerCase().includes("already authenticated")) {
        router.push("/profile");
      }
    })();
  }, []);

  //Show authentication error or send to profile is logged in
  useEffect(() => {
    if (props.authErr) {
      setSignInError(props.authErr);
    }

    if (props.userId) {
      router.push("/profile");
    }
  }, [props.authErr, props.userId]);

  //Authenticate user on submitting credentials
  const authSubmit = (e) => {
    e.preventDefault();

    props.authenticateUser(email, password);
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
          <label htmlFor="password" className="t">
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
        <span className="text-red-600">{signInError}</span>
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

const mapStateToProps = (state) => {
  return {
    authErr: state.authenticate.authErr,
    userId: state.authenticate.userId,
  };
};

export default connect(mapStateToProps, {
  authenticateUser,
})(Signin);

//Enable below in prod built and try (Comment the first useEffect)

// export async function getServerSideProps(context) {
//   const { data } = await axios.get("/login");

//   console.log(data)
//   if (data.message.toLowerCase().includes("already authenticated")) {
//     return {
//       redirect: {
//         destination: "/profile",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {

//     }, // will be passed to the page component as props
//   };
// }
