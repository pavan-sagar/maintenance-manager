import React, { useEffect, useState } from "react";
import { axios } from "../config";
import { getMonthName } from "../utilities";

const LastPayment = (props) => {
  const [lastPaidAmount, setLastPaidAmount] = useState();
  const [lastPaidDatetime, setLastPaidDatetime] = useState();
  const [lastPaidPeriod, setLastPaidPeriod] = useState();
  const [lastPaidYear, setLastPaidYear] = useState();
  const flatID = `${props.resident.flatNo}-${props.resident.wing}-${props.resident.societyName}-${props.resident.pincode}`;

  useEffect(async () => {
    const { data, status } = await axios.get(
      `/get/transactions/last?flatID=${flatID}`
    );

    if (status === 200) {
      setLastPaidAmount(data.amount);
      setLastPaidDatetime(new Date(data.paidOn).toLocaleString());
      setLastPaidPeriod(data.period);
      setLastPaidYear(data.year);
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

  if (lastPaidAmount && lastPaidPeriod) {
    return (
      <div>
        {console.log(lastPaidPeriod)}
        <section className="grid grid-cols-2 gap-y-2 w-max p-2 mx-auto border-2 rounded shadow">
          <span className="col-span-2 font-semibold">
            Last Payment Details:
          </span>
          <span className="font-medium text-blue-500">Amount</span>
          <span> : INR {lastPaidAmount}</span>
          <span className="font-medium text-blue-500">Date </span>
          <span>: {lastPaidDatetime} LT</span>
          <span className="font-medium text-blue-500">Maintenance Period </span>
          <span>
            : {getMonthName(lastPaidPeriod[0] - 1, 3)}{" "}
            {lastPaidPeriod.length > 1 &&
              ` to ${getMonthName(
                lastPaidPeriod[lastPaidPeriod.length - 1] - 1,
                3
              )}`}{" "}
            {lastPaidYear}
          </span>
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

export default LastPayment;
