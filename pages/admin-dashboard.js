import { useState } from "react";
import { connect } from "react-redux";
import Dashboard from "../components/Admin/Dashboard";
import CreateBuilding from "../components/Admin/CreateBuilding";
import { SliderMenu } from "../components/Admin/SliderMenu";
import CreateSociety from "../components/Admin/CreateSociety";
import RegisterOwnFlat from "../components/Admin/RegisterOwnFlat";
import ManageBuilding from "../components/Admin/ManageBuilding";
import ResidentTransactions from "../components/Admin/ResidentTransactions";
import ResidentsDetails from "../components/Admin/ResidentsDetails";


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
      name: "Residents details",
      action: () => setActivePage("residents-details"),
    },
    {
      name: "Show Defaulters",
      action: () => setActivePage("show-defaulters"),
    },
    {
      name: "Register as Resident",
      action: () => setActivePage("register-as-resident"),
    },
    {
      name: "Manage Building",
      action: () => setActivePage("manage-building"),
    },
    {
      name: "Resident Transactions",
      action: () => setActivePage("resident-transactions"),
    },
  ];

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "create-building":
        return <CreateBuilding />;
      case "create-society":
        return <CreateSociety />;
      case "register-as-resident":
        return <RegisterOwnFlat />;
      case "manage-building":
        return <ManageBuilding />;
      case "resident-transactions":
        return <ResidentTransactions />;
      case "residents-details":
        return <ResidentsDetails />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="mt-5 mb-3">
      {(props.userInfo.isAdmin && (
        <>
          <span>Welcome Admin {props.userInfo.name}</span>
          <div className="w-full grid grid-cols-3 items-start justify-start">
            <SliderMenu items={items} className="col-span-1" />
            <div className="col-span-2">{renderActivePage()}</div>
          </div>
        </>
      )) || <p>Access to this section is restricted to Admins only.</p>}
    </div>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(adminDashboard);
