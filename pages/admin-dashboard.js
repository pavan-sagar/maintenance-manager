import { useState } from "react";
import { connect } from "react-redux";
import Dashboard from "../components/Admin/Dashboard";
import CreateBuilding from "../components/Admin/CreateBuilding";
import { SliderMenu } from "../components/Admin/SliderMenu";

function adminDashboard(props) {
  const [activePage, setActivePage] = useState("dashboard");
  const items = [
    {
      name: "Go to Dashboard",
      action: () => setActivePage("dashboard"),
    },
    {
      name: "Create Building",
      action: () => setActivePage("create-building"),
    },
    {
      name: "Create Society",
      action: () => setActivePage("create-society"),
    },
    {
      name: "Show Residents details",
      action: () => setActivePage("show-residents-details"),
    },
    {
      name: "Show Defaulters",
      action: () => setActivePage("show-defaulters"),
    },
  ];

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "create-building":
        return <CreateBuilding />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="mt-5 mb-3">
      {(props.userInfo.isAdmin && (
        <span>Welcome Admin {props.userInfo.name}</span>
      )) || <p>Access to this section is restricted to Admins only.</p>}
      <div className="w-full grid grid-cols-2 items-start justify-start">
        <SliderMenu items={items} />
        <div className="items-start w-max inline-block">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(adminDashboard);
