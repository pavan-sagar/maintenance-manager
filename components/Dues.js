import React, { useState, useEffect } from "react";
import { axios } from "../config";
import { getMonthName } from "../utilities";

export default function Dues(props) {
  const [duesList, setDuesList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const flatID = `${props.resident.flatNo}-${props.resident.wing}-${props.resident.societyName}-${props.resident.pincode}`;

  useEffect(async () => {
    getDues();
  }, [isLoading]);

  const getDues = async () => {
    await axios.get(`/calculate/dues?flatID=${flatID}`);
    const { data } = await axios.get(`/get/dues?flatID=${flatID}`);
    setDuesList(data);
    setIsLoading(false);
  };

  const renderDuesList = () => {
    if (duesList.length < 1) {
      return (
        <div className="grid grid-cols-2 gap-y-1 border-b-2 border-l-2 border-r-2 p-2">
          <span className="col-span-2 font-medium text-blue-500 text-center">
            No dues to be paid
          </span>
        </div>
      );
    } else {
      return duesList.map((due, idx) => (
        <div className="grid grid-cols-2 gap-y-1 border-b-2 border-l-2 border-r-2 p-2">
          <span className="font-medium text-blue-500">Sr No.</span>
          <span>: {idx + 1}</span>
          <span className="font-medium text-blue-500">Period </span>
          <span>
            : {getMonthName(due.period[0] - 1, 3)}{" "}
            {due.period.length > 1 &&
              ` to ${getMonthName(
                due.period[due.period.length - 1] - 1,
                3
              )}`}{" "}
            {due.year}
          </span>
          <span className="font-medium text-blue-500">Amount</span>
          <span>: {due.amount}</span>
        </div>
      ));
    }
  };

  return (
    (!isLoading && (
      <div className="mt-10 border-2 w-max mx-auto shadow rounded mb-5">
        <section className="flex flex-col p-2">
          <h2 className="font-semibold border-2 p-1">Previous Dues:</h2>
          {renderDuesList()}
        </section>
      </div>
    )) ||
    "Loading..."
  );
}
