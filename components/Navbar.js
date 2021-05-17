import Link from "next/link";
import { connect } from "react-redux";

import Signout from "./Signout";

function Navbar(props) {
  return (
    <header className="w-screen">
      <nav className="border-solid border-b-2 border-white-900 p-3 shadow-sm w-full">
        <ul className="flex flex-row">
          <li className="inline-block">
            <Link href="/">Maintenance Manager</Link>
          </li>
          <li className="ml-auto">{props.isSignedIn && <Signout />}</li>
        </ul>
      </nav>
    </header>
  );
}

const mapStateToProps = (state) => ({
  isSignedIn: state.authenticate.isSignedIn,
});

export default connect(mapStateToProps, null)(Navbar);
