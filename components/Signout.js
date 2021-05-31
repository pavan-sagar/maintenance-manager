import { motion } from "framer-motion";
import router from "next/router";
import { connect } from "react-redux";
import { axios } from "../config";

import { SIGN_OUT } from "../slices/authenticateSlice";

export const SignOut = (props) => {
  const logOut = async () => {
    const { statusText } = await axios("/signout");

    if (statusText === "OK") {
      props.SIGN_OUT();
      router.push("/");
    }
  };

  return (
    <motion.a
      onClick={logOut}
      href="#"
      whileHover={{
        color: "#EE5D36",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      
    >
      Sign Out
    </motion.a>
  );
};

export default connect(null, { SIGN_OUT })(SignOut);
