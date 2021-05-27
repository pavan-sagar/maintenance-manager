import LastPayment from "../components/LastPayment";
import Dues from "../components/Dues";
import { connect } from "react-redux";
import UpcomingPayment from "../components/UpcomingPayment";

export const Dashboard = (props) => {
  return (
    <div className="flex flex-col justify-start h-max">
      <p className="p-2">
        Welcome <i>{props.resident ? props.resident.name : "Pavan"}</i>
      </p>
      <UpcomingPayment resident={props.resident} />
      <LastPayment resident={props.resident} />
      <Dues resident={props.resident} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  resident: state.authenticate.userInfo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
