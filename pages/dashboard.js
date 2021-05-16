import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { axios } from "../config";

export const Dashboard = (props) => {
  const [lastPaidAmount, setLastPaidAmount] = useState();
  const [lastPaidDatetime, setLastPaidDatetime] = useState();
  const [lastPaidPeriod, setLastPaidPeriod] = useState();

  useEffect(async () => {
    const { data, status } = await axios.get(
      `/get/transactions?flatID=${props.resident.pincode}-${props.resident.societyName}-${props.resident.wing}-${props.resident.flatNo}`
    );

    if (status === 200) {
      setLastPaidAmount(data[0].amount);
      setLastPaidDatetime(data[0].paidOn);
      setLastPaidPeriod(data[0].period);
    }
  });
  // const testTransact = async () => {
  //   console.log(props.resident);
  //   const { data } = axios.post("/transact", {
  //     amount: 100,
  //     flatID: `${props.resident.pincode}-${props.resident.societyName}-${props.resident.wing}-${props.resident.flatNo}`,
  //     period: "Jan to Mar 2021",
  //     paidOn: new Date().toLocaleString(),
  //   });
  // };
  if (lastPaidAmount) {
    return (
      <div>
        <p className="p-2">
          <i>Welcome {props.resident ? props.resident.name : "Pavan"}</i>
        </p>

        <section className="grid grid-cols-2 gap-2 w-max p-2 mx-auto border-2 rounded">
          <span className="col-span-2">Last Payment Details:</span>
          <span>Amount:</span>
          <span> INR {lastPaidAmount}</span>
          <span>Date: </span>
          <span>{lastPaidDatetime}</span>
          <span>Maintenance Period : </span>
          <span>{lastPaidPeriod}</span>
        </section>

        {/* <button className="bg-blue-300 rounded p-2" onClick={testTransact}>
        Send test transactions
      </button> */}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

const mapStateToProps = (state) => ({
  resident: state.authenticate.userInfo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
