import React, { useEffect, useState } from "react";
import { axios } from "../config";
import { getMonthName } from "../utilities";

const UpcomingPayment = (props) => {
  const [amount, setAmount] = useState();
  const [datetime, setDatetime] = useState();
  const [periodRange, setPeriodRange] = useState();
  const [year, setYear] = useState();
  const buildingID = `${props.resident.wing}-${props.resident.societyName}-${props.resident.pincode}`;

  useEffect(async () => {
    const { data, status } = await axios.get(
      `/get/building?buildingID=${buildingID}`
    );

    if (status === 200) {
      setAmount(data.upcomingDueDetails.amount);
      setDatetime(new Date(data.upcomingDueDetails.date).toLocaleDateString());
      setPeriodRange(data.upcomingDueDetails.periodRange);
      setYear(data.upcomingDueDetails.year);
    }
  }, [datetime]);

  if (amount && datetime && periodRange) {
    return (
      <div className="p-1 m-auto">
        <section className="grid grid-cols-2 gap-y-2 w-max p-2 mx-auto border-2 rounded shadow">
          <span className="col-span-2 font-semibold">
            Upcoming Payment Details:
          </span>
          <span className="font-medium text-blue-500">Amount</span>
          <span> : INR {amount}</span>
          <span className="font-medium text-blue-500">Date </span>
          <span>: {datetime}</span>
          <span className="font-medium text-blue-500">Maintenance Period </span>
          <span>
            : {getMonthName(periodRange[0] - 1, 3)}{" "}
            {periodRange.length > 1 &&
              ` to ${getMonthName(
                periodRange[periodRange.length - 1] - 1,
                3
              )}`}{" "}
            {year}
          </span>
        </section>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default UpcomingPayment;
