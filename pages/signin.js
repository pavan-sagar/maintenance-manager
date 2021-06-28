import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { authenticateUser } from "../slices/authenticateSlice";
import { axios } from "../config";
import { motion } from "framer-motion";

export function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const router = useRouter();

  //Redirect user to profile is already logged in
  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/signin");

      if (data.message.toLowerCase().includes("already authenticated")) {
        if (props.userInfo.isAdmin) {
          router.push("/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    })();
  }, []);

  //Show authentication error or send to dashboard if already logged in
  useEffect(() => {
    if (props.authErr) {
      setSignInError(props.authErr);
    }

    if (props.userId) {
      if (props.userInfo.isAdmin) {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [props.authErr, props.userId]);

  //Authenticate user on submitting credentials
  const authSubmit = (e) => {
    e.preventDefault();

    props.authenticateUser(email, password);
  };

  return (
    !props.userId && (
      <div className="flex justify-center relative w-screen  px-2  mt-[3rem]">
        <form
          onSubmit={authSubmit}
          className="grid grid-cols-2 grid-rows-3 gap-y-1"
        >
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
          {signInError && <span className="text-red-600">{signInError}</span>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{
              scale: 0.95,
              transition: { type: "spring", stiffness: 75 },
            }}
            type="submit"
            className="col-span-2 md mt-[1rem] self-end px-8 py-2"
          >
            Submit
          </motion.button>
        </form>

        <style jsx>
          {`
            input {
              height: 2rem;
            }
          `}
        </style>
      </div>
    )
  );
}

const mapStateToProps = (state) => {
  return {
    authErr: state.authenticate.authErr,
    userId: state.authenticate.userId,
    userInfo: state.authenticate.userInfo,
  };
};

export default connect(mapStateToProps, {
  authenticateUser,
})(Signin);

//Enable below in prod built and try (Comment the first useEffect)

// export async function getServerSideProps(context) {
//   const { data } = await axios.get("/signin");

//   console.log(context)
//   if (data.message.toLowerCase().includes("already authenticated")) {
//     console.log("inside redirect if")
//     return {
//       redirect: {
//         destination: "http://localhost:3000/dashboard",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {

//     }, // will be passed to the page component as props
//   };
// }
