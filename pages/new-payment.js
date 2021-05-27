import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import { enUS } from "date-fns/locale";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { axios } from "../config";

function new_payment(props) {
  const [maintenancePerMonth, setMaintenancePerMonth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState();
  const [upcomingDuePeriodRange, setUpcomingDuePeriodRange] = useState([]);
  const [fromMonth, setFromMonth] = useState(1);
  const [toMonth, setToMonth] = useState(12);

  const buildingID = `${props.resident.wing}-${props.resident.societyName}-${props.resident.pincode}`;

  useEffect(() => {
    getBuildingInfo();
  }, [isLoading]);
  const getBuildingInfo = async () => {
    const { data, status } = await axios(
      `/get/building?buildingID=${buildingID}`
    );

    if (status === 200) {
      setMaintenancePerMonth(data.maintenancePerMonth);
      setUpcomingDuePeriodRange(data.upcomingDueDetails.periodRange);

      setIsLoading(false);
    } else {
      alert("An error occured. Please try again.");
    }
  };

  const renderMonths = () => {
    const monthsArray = eachMonthOfInterval({
      start: new Date(2020, 0, 1),
      end: new Date(2020, 11, 1),
    });

    return monthsArray.map((month, idx) => (
      <option value={idx + 1} key={idx + 1}>
        {enUS.localize.month(month.getMonth(), { width: "abbreviated" })}
      </option>
    ));
  };

  const renderYears = () => {
    const currentYear = new Date(Date.now()).getFullYear();
    const endYear = currentYear + 2;

    let yearArr = [];
    for (let i = currentYear; i <= endYear; i++) {
      yearArr.push(i);
    }

    return yearArr.map((year, idx) => (
      <option key={idx + 1} value={year}>
        {year}
      </option>
    ));
  };

  return (
    (!isLoading && (
      <div className="grid grid-cols-2 gap-x-5 gap-y-5 mx-auto w-[90%] md:w-max border-2 rounded-md shadow-md p-2">
        <span className="col-span-2 font-semibold italic">New Payment</span>
        <div className="flex flex-col justify-center">
          <label htmlFor="fromMonth" className="font-medium text-blue-500">
            From Month
          </label>
          <select
            name="fromMonth"
            value={fromMonth}
            onChange={(e) => setFromMonth(e.target.value)}
            className="w-max"
          >
            {renderMonths()}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="toMonth" className="font-medium text-blue-500">
            To Month
          </label>

          <select
            name="toMonth"
            value={toMonth}
            onChange={(e) => setToMonth(e.target.value)}
            className="w-max"
          >
            {renderMonths()}
          </select>
        </div>
        <label htmlFor="year" className="font-medium text-blue-500">
          Year
        </label>

        <select name="year" className="w-max">
          {renderYears()}
        </select>
        <label
          htmlFor="monthlyMaintenaince"
          className="font-medium text-blue-500"
        >
          Monthly Maintenance
        </label>

        <span>{maintenancePerMonth}</span>
        <label htmlFor="amount" className="font-medium text-blue-500">
          Amount
        </label>

        <span>{(toMonth - fromMonth + 1) * maintenancePerMonth}</span>
        <button
          className="col-span-2 w-full justify-self-center bg-blue-600 text-white hover:bg-[#3f83f8] rounded-md py-3 inline-block focus:outline-none focus:ring focus-border-blue-600"
          type="submit"
        >
          Pay
        </button>
      </div>
    )) ||
    "Loading..."
  );
}

const mapStateToProps = (state) => ({
  resident: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(new_payment);
