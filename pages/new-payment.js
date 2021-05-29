import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import { enUS } from "date-fns/locale";
import { Formik, Field, Form, ErrorMessage } from "formik";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { axios } from "../config";

function new_payment(props) {
  const [maintenancePerMonth, setMaintenancePerMonth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingDueDetails, setUpcomingDueDetails] = useState();
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

  return (
    (!isLoading && (
      <Formik
        initialValues={{
          fromMonth: 1,
          toMonth: 12,
          year: new Date(Date.now()).getFullYear(),
        }}
        validate={({ fromMonth, toMonth, year }) => {
          const errors = {};

          //To Month cannot be less than From Month
          if (Number(toMonth) < Number(fromMonth)) {
            errors.toMonth = `"To" Month cannot be less than "From" month`;
          } else if (
            upcomingDueDetails?.year === Number(year) &&
            upcomingDueDetails?.periodRange.includes(Number(fromMonth))
          ) {
            errors.toMonth =
              "Selected months are of upcoming or previous payment period. Kindly choose months and/or year for future date range.";
          }

          return errors;
        }}
        onSubmit={(values) => {
          //IMPLEMENT PAYMENT GATEWAY INTEGRATION HERE
        }}
      >
        {({ isSubmitting, values: { fromMonth, toMonth, year } }) => (
          <Form>
            <div className="grid grid-cols-2 items-start gap-x-5 gap-y-5 mx-auto w-[90%] md:w-max border-2 rounded-md shadow-md p-2">
              <span className="col-span-2 font-semibold text-center italic">
                New Payment
              </span>
              <div className="flex flex-col justify-start">
                <label
                  htmlFor="fromMonth"
                  className="font-medium text-blue-500"
                >
                  From Month
                </label>
                <Field as="select" name="fromMonth" className="w-max">
                  {renderMonths()}
                </Field>
              </div>
              <div className="flex flex-col">
                <label htmlFor="toMonth" className="font-medium text-blue-500">
                  To Month
                </label>

                <Field as="select" name="toMonth" className="w-max">
                  {renderMonths()}
                </Field>
              </div>
              <ErrorMessage
                name="toMonth"
                component="p"
                className="col-span-2 text-sm justify-self-center inline-block md:w-[20rem] text-red-600"
              />

              <label htmlFor="year" className="font-medium text-blue-500">
                Year
              </label>

              <Field as="select" name="year" className="w-max">
                {renderYears()}
              </Field>

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

              <span>
                {
                  //Display amount only if its positive
                  (toMonth - fromMonth + 1) * maintenancePerMonth > 0
                    ? (toMonth - fromMonth + 1) * maintenancePerMonth
                    : ""
                }
              </span>

              <button
                className="col-span-2 w-full justify-self-center bg-blue-600 text-white hover:bg-[#3f83f8] rounded-md py-3 inline-block focus:outline-none focus:ring focus-border-blue-600"
                type="submit"
              >
                Pay
              </button>
            </div>
          </Form>
        )}
      </Formik>
    )) ||
    "Loading..."
  );
}

const mapStateToProps = (state) => ({
  resident: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(new_payment);
