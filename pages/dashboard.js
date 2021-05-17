import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { axios } from "../config";

export const Dashboard = (props) => {
  const [lastPaidAmount, setLastPaidAmount] = useState();
  const [lastPaidDatetime, setLastPaidDatetime] = useState();
  const [lastPaidPeriod, setLastPaidPeriod] = useState();
  const flatID = `${props.resident.pincode}-${props.resident.societyName}-${props.resident.wing}-${props.resident.flatNo}`;

  useEffect(async () => {
    const { data, status } = await axios.get(
      `/get/transactions/last?flatID=${flatID}`
    );

    if (status === 200) {
      setLastPaidAmount(data.amount);
      setLastPaidDatetime(data.paidOn);
      setLastPaidPeriod(data.period);
    }
  });
  // const testTransact = async () => {
  //   const { data } = axios.post("/transact", {
  //     amount: 100,
  //     flatID: `${props.resident.pincode}-${props.resident.societyName}-${props.resident.wing}-${props.resident.flatNo}`,
  //     period: "Jan to Mar 2021",
  //     paidOn: new Date().toLocaleString(),
  //   });
  // };

  // const testLastTransact = async () => {
  //   const { data, status } = await axios.get(
  //     `/get/transactions/last?flatID=${props.resident.pincode}-${props.resident.societyName}-${props.resident.wing}-${props.resident.flatNo}`
  //   );

  //   if (status === 200) {
  //     console.log(data);
  //   }
  // };

  if (lastPaidAmount) {
    return (
      <div>
        <p className="p-2">
          Welcome <i>{props.resident ? props.resident.name : "Pavan"}</i>
        </p>

        <section className="grid grid-cols-2 gap-y-2 w-max p-2 mx-auto border-2 rounded shadow">
          <span className="col-span-2 font-semibold">Last Payment Details:</span>
          <span className="font-medium text-blue-500">Amount</span>
          <span> : INR {lastPaidAmount}</span>
          <span className="font-medium text-blue-500">Date </span>
          <span>: {lastPaidDatetime} LT</span>
          <span className="font-medium text-blue-500">Maintenance Period </span>
          <span>: {lastPaidPeriod}</span>
        </section>

        {/* <button className="bg-blue-300 rounded p-2" onClick={testTransact}>
          Send test transactions
        </button>
        <br />
        <button className="bg-blue-300 rounded p-2" onClick={testLastTransact}>
          Send test last transaction
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
