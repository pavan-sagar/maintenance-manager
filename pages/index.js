import { motion } from "framer-motion";
import { connect } from "react-redux";

import Link from "next/link";

const Home = (props) => {
  return (
    <div className="relative h-screen max-h-full flex flex-col justify-start text-center">
      <p className="mt-60">Pay and Manage Your Maintenance Easily !!!</p>
      {(!props.isSignedIn && (
        <div className="login buttons mt-10 sm:flex-col">
          <Link href="/signin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{
                scale: 0.95,
                transition: { type: "spring", stiffness: 75 },
              }}
              className="bg-blue-600 text-white hover:bg-[#3f83f8] px-8 py-2 mr-5 rounded-md focus:outline-none focus:ring focus-border-blue-500"
            >
              Sign In
            </motion.button>
          </Link>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{
                scale: 0.95,
                transition: { type: "spring", stiffness: 75 },
              }}
              className="bg-blue-600 text-white hover:bg-[#3f83f8] px-8 py-2 rounded-md focus:outline-none focus:ring focus-border-blue-500"
            >
              Create Account
            </motion.button>
          </Link>
        </div>
      )) || (
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{
              scale: 0.95,
              transition: { type: "spring", stiffness: 75 },
            }}
            className="bg-blue-600 text-white hover:bg-[#3f83f8] mt-10 px-8 py-2 rounded-md focus:outline-none focus:ring focus-border-blue-500"
          >
            Go to Dashboard
          </motion.button>
        </Link>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isSignedIn: state.authenticate.isSignedIn,
});

export default connect(mapStateToProps, null)(Home);
