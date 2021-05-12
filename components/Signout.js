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
    <a onClick={logOut} href="#" className="hover:text-[#EE5D36]">
      Sign Out
    </a>
  );
};

export default connect(null, { SIGN_OUT })(SignOut);
