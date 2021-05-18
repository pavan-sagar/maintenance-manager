import LastPayment from "../components/LastPayment";
import Dues from "../components/Dues";
import { connect } from "react-redux";


export const Dashboard = (props) => {
  return (
    <div>
      <p className="p-2">
        Welcome <i>{props.resident ? props.resident.name : "Pavan"}</i>
      </p>
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
