import LastPayment from "../components/LastPayment";
import Dues from "../components/Dues";
import { connect } from "react-redux";
import UpcomingPayment from "../components/UpcomingPayment";

export const Dashboard = (props) => {
  return (
    <div className="flex flex-col h-screen">
      <p className="p-2">
        Welcome <i>{props.resident ? props.resident.name : "Pavan"}</i>
      </p>
      {(props.resident.societyName && (
        <>
          <UpcomingPayment resident={props.resident} />
          <LastPayment resident={props.resident} />
          <Dues resident={props.resident} />
        </>
      )) || <p className="mt-[10rem]">No property has been registered.</p>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  resident: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(Dashboard);
