import React from "react";
import { connect } from "react-redux";

function adminDashboard(props) {
  return (
    <div className="mt-10">
      {(props.userInfo.isAdmin && (
        <div>Welcome Admin {props.userInfo.name}</div>
      )) || <p>Access to this section is restricted to Admins only.</p>}
    </div>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(adminDashboard);
