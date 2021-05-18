import React, { useState, useEffect } from "react";
import { axios } from "../config";
import { getMonthName } from "../utilities";

export default function Dues(props) {
  const [period, setPeriod] = useState("Jan to Mar");
  const [year, setYear] = useState(2021);
  const [amount, setAmount] = useState(9000);
  const [count, setCount] = useState(1);
  const [duesList, setDuesList] = useState();
  const flatID = `${props.resident.pincode}-${props.resident.societyName}-${props.resident.wing}-${props.resident.flatNo}`;

  useEffect(() => {
    getDues();
  });

  const getDues = async () => {
    const { data } = await axios.get(`/get/dues?flatID=${flatID}`);

    if (data.length < 1) {
      setDuesList(
        <div className="grid grid-cols-2 gap-y-1 border-b-2 border-l-2 border-r-2 p-2">
          <span className="col-span-2 font-medium text-blue-500 text-center">No dues to be paid</span>
        </div>
      );

      return null;
    }

    setDuesList(
      data.map((due, idx) => (
        <div className="grid grid-cols-2 gap-y-1 border-b-2 border-l-2 border-r-2 p-2">
          <span className="font-medium text-blue-500">Sr No.</span>
          <span>: {idx + 1}</span>
          <span className="font-medium text-blue-500">Period </span>
          <span>
            : {getMonthName(due.period[0] - 1, 3)} to{" "}
            {getMonthName(due.period[due.period.length - 1] - 1, 3)} {due.year}
          </span>
          <span className="font-medium text-blue-500">Amount</span>
          <span>: {due.amount}</span>
        </div>
      ))
    );
    return null;
  };

  return (
    (duesList && (
      <div className="mt-10 border-2 w-max mx-auto shadow rounded">
        <section className="flex flex-col p-2">
          <h2 className="font-semibold border-2 p-1">Previous Dues:</h2>
          {duesList}
        </section>
      </div>
    )) ||
    "Loading..."
  );
}
