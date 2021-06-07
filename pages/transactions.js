import React, { useState, useEffect } from "react";
import { axios } from "../config";
import { connect } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { getMonthName } from "../utilities";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-columnHeader,  .MuiDataGrid-columnHeaderTitleContainer ": {
      backgroundColor: "#b7d2ff",
    },
  },
});

const transactions = (props) => {
  const [transactions, setTransactions] = useState([]);
  const flatID = `${props.resident.flatNo}-${props.resident.wing}-${props.resident.societyName}-${props.resident.pincode}`;
  const classes = useStyles();

  const columns = [
    { field: "id", headerName: "Sr No", width: 120 },
    {
      field: "period",
      headerName: "Period",
      width: 120,
      description: "From and To month.",
    },
    { field: "year", headerName: "Year", width: 120 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "paidOn", headerName: "Paid On", width: 130 },
  ];

  const rows = [];

  useEffect(async () => {
    const { data, statusText } = await axios.get(
      `get/transactions?flatID=${flatID}`
    );

    if (statusText == "OK") {
      setTransactions(data);
    }
  }, [flatID]);

  transactions.map((item, idx) => {
    rows.push({
      id: idx + 1,
      amount: item.amount,
      year: item.year,
      period: `${getMonthName(item.period[0] - 1, 3)}
      ${
        item.period[0] != item.period[item.period.length - 1]
          ? ` to ${getMonthName(item.period[item.period.length - 1] - 1, 3)}`
          : ""
      }`,
      paidOn: new Date(item.createdAt).toLocaleDateString(),
    });
  });

  return (
    <div className="w-full h-screen">
      <div className="w-full md:w-[50%] h-[65%] mx-auto mt-5 p-4">
        <div className="grid grid-cols-2 w-max mb-5">
          <span className="col-span-2 font-semibold justify-self-start mb-10 text-blue-500 text-xl  italic">
            Transactions
          </span>
          <span className="justify-self-start font-medium text-blue-500">
            Flat:
          </span>
          <span className="font-light italic">
            {props.resident.wing} - {props.resident.flatNo}
          </span>
          <span className="justify-self-start font-medium text-blue-500 ">
            Society:
          </span>
          <span className="font-light italic">
            {props.resident.societyName}
          </span>
        </div>
        <DataGrid
          className={classes.root}
          rows={rows}
          columns={columns}
          pageSize={10}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  resident: state.authenticate.userInfo,
});

export default connect(mapStateToProps, null)(transactions);
