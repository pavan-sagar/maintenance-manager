import React from "react";
import { connect } from "react-redux";
import { SliderMenu } from "../components/Admin/SliderMenu";

function adminDashboard(props) {
  const items = [
    {
      name: "Go to Dashboard",
      action: () => console.log("Go to Dashboard clicked"),
    },
    {
      name: "Create Building",
      action: () => console.log("Create building clicked"),
    },
    {
      name: "Create Society",
      action: () => console.log("Create society clicked"),
    },
    {
      name: "Show Residents details",
      action: () => console.log("Show Residents clicked"),
    },
    {
      name: "Show Defaulters",
      action: () => console.log("Show Defaulters clicked"),
    },
  ];
  return (
    <div className="mt-5 mb-">
      {(props.userInfo.isAdmin && (
        <div>Welcome Admin {props.userInfo.name}</div>
      )) || <p>Access to this section is restricted to Admins only.</p>}
      <SliderMenu items={items} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(adminDashboard);
