import Link from "next/link";
import { connect } from "react-redux";

import Signout from "./Signout";
import { SIGN_OUT } from "../slices/authenticateSlice";

function Navbar(props) {
  return (
    <header>
      <nav className="border-solid border-b-2 border-white-900 p-3 shadow-sm">
        <ul className="flex flex-row">
          <li className="inline-block">
            <Link href="/">Maintenance Manager</Link>
          </li>
          <li style={{ display: "inline-block", marginLeft: "auto" }}>
            <Signout />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default connect(null, { SIGN_OUT })(Navbar);
