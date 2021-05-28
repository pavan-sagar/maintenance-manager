import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import { enUS } from "date-fns/locale";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { axios } from "../config";

function new_payment(props) {
  const [maintenancePerMonth, setMaintenancePerMonth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState();
  const [upcomingDueDetails, setUpcomingDueDetails] = useState();
  const [fromMonth, setFromMonth] = useState(1);
  const [toMonth, setToMonth] = useState(12);
  const [year, setYear] = useState(new Date(Date.now()).getFullYear());
  const [valErrToMonth, setValErrToMonth] = useState("");
  const [valErrPrevPeriod, setValErrPrevPeriod] = useState("");

  const buildingID = `${props.resident.wing}-${props.resident.societyName}-${props.resident.pincode}`;

  useEffect(() => {
    getBuildingInfo();
  }, [isLoading]);

  useEffect(() => {
    setAmount((prevAmount) => {
      if ((toMonth - fromMonth + 1) * maintenancePerMonth <= 0) {
        setValErrToMonth(`"To" Month cannot be less than "From" month`);
      } else {
        setValErrToMonth("");
      }
      if (prevAmount != (toMonth - fromMonth + 1) * maintenancePerMonth) {
        return (toMonth - fromMonth + 1) * maintenancePerMonth;
      } else {
        return prevAmount;
      }
    });
    //Check if selected month and year belongs to upcoming or past dues period range
    if (
      upcomingDueDetails?.year === Number(year) &&
      upcomingDueDetails?.periodRange.includes(Number(fromMonth))
    ) {
      setValErrPrevPeriod(
        "Selected months are of upcoming or previous payment period. Kindly choose months and/or year for future date range."
      );
    } else {
      //Reset the validation error value to blank

      setValErrPrevPeriod("");
    }
  }, [fromMonth, toMonth, year]);

  const getBuildingInfo = async () => {
    const { data, status } = await axios(
      `/get/building?buildingID=${buildingID}`
    );

    if (status === 200) {
      setMaintenancePerMonth(data.maintenancePerMonth);
      setUpcomingDueDetails(data.upcomingDueDetails);

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
      <option value={Number(idx + 1)} key={idx + 1}>
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

  const handleSubmit = () => {
    if (valErrToMonth || valErrPrevPeriod) {
      console.log("There are errors");
    } else {
      console.log("All good");
    }
  };

  return (
    (!isLoading && (
      <div className="grid grid-cols-2 items-start gap-x-5 gap-y-5 mx-auto w-[90%] md:w-max border-2 rounded-md shadow-md p-2">
        <span className="col-span-2 font-semibold text-center italic">
          New Payment
        </span>
        <div className="flex flex-col justify-start">
          <label htmlFor="fromMonth" className="font-medium text-blue-500">
            From Month
          </label>
          <select
            name="fromMonth"
            value={fromMonth}
            onChange={(e) => setFromMonth(Number(e.target.value))}
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
            onChange={(e) => setToMonth(Number(e.target.value))}
            className="w-max"
          >
            {renderMonths()}
          </select>

          {valErrToMonth && (
            <p className="text-sm overflow-auto w-20 text-red-600">
              {valErrToMonth}
            </p>
          )}
        </div>
        <label htmlFor="year" className="font-medium text-blue-500">
          Year
        </label>

        <select
          name="year"
          className="w-max"
          onChange={(e) => setYear(Number(e.target.value))}
        >
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

        <span>{amount > 0 ? amount : ""}</span>
        {valErrPrevPeriod && (
          <p className="col-span-2 text-sm overflow-auto text-red-600">
            {valErrPrevPeriod}
          </p>
        )}
        <button
          className="col-span-2 w-full justify-self-center bg-blue-600 text-white hover:bg-[#3f83f8] rounded-md py-3 inline-block focus:outline-none focus:ring focus-border-blue-600"
          type="submit"
          onClick={handleSubmit}
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
