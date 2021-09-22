import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DataGrid } from "@material-ui/data-grid";

import { makeStyles } from "@material-ui/core";

import { capitalize,getMonthName } from "../../utilities";

const columns = [
  { field: "id", headerName: "Sr No", flex: 0.3 },
  { field: "flatNo", headerName: "Flat No", flex: 0.3 },

  { field: "period", headerName: "Period", flex: 0.5 },
  { field: "year", headerName: "Year", flex: 0.5 },
  { field: "amount", headerName: "Amount", flex: 0.5 },
];

const rows = [];

//Style the Grid headers
const useStyles = makeStyles({
    root: {
      "& .MuiDataGrid-columnHeader,  .MuiDataGrid-columnHeaderTitleContainer ": {
        backgroundColor: "#b7d2ff",
      },
    },
  });

function ShowDefaulters() {
  const adminEmailID = useSelector((state) => state.authenticate.userId);
  const [isLoading, setIsLoading] = useState(true);

  const [building, setBuilding] = useState("");
  const [society, setSociety] = useState("");
  const [noDues, setNoDues] = useState(false);

  const classes = useStyles();


  //Find the building that is managed by the admin
  useEffect(async () => {
    try {
      const { data } = await axios.get("/get/building", {
        params: {
          managerEmail: adminEmailID,
        },
      });

      if (data) {
        console.log(data);
        setBuilding(data.buildingID.split("-")[0]);
        setSociety(data.buildingID.split("-")[1]);

        const response = await axios.get("/get/buildingid-dues", {
          params: {
            buildingID: data.buildingID,
          },
        });

        if (response.data.length) {
          response.data.map(({ flatID, period, year, amount }, idx) => {
            rows.push({
              id: idx + 1,
              flatNo: flatID.split("-")[0],
              period: getPeriodNames(period),
              year,
              amount,
            });
          });
        } else {
          setNoDues(true);
        }
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e)
      //   alert("An error has occured. Please try again.");
    }
  }, []);

  const getPeriodNames = (period) =>{
    //The month number is 0 indexed. Hence the -1.
    const startPeriod = getMonthName(Number(period[0])-1,3)
    const endPeriod = getMonthName(Number(period[period.length-1])-1,3)

    console.log({startPeriod,endPeriod})
    if (startPeriod === endPeriod){
      return startPeriod
    }else{
      return `${startPeriod} to ${endPeriod}`
    }

  }

  const renderDefaulterDetails = () => {
    return (
      <div>
        <span className="block text-center mb-9 text-xl font-medium">
          Defaulters Details
        </span>
        <div className="grid grid-cols-2 w-max">
          <label className="w-max font-semibold">Society: </label>
          <span className="italic">{capitalize(society)}</span>
          <label className="w-max font-semibold">Building : </label>
          <span className="italic">{capitalize(building)}</span>

          {(noDues && (
            <span className="inline-block pt-5">
              There are no pending dues by any resident of this building.
            </span>
          )) || (
            <span className="inline-block pt-10">
              Here is the list of pending defaulters.
            </span>
          )}
        </div>
        <div
          style={{
            height: 400,
            width: "100%",
            marginTop: "1.5rem",
            overflow: "scroll",
          }}
        >
          <DataGrid className={classes.root} columns={columns} rows={rows} pageSize={5} />
        </div>
      </div>
    );
  };

  return (!isLoading && renderDefaulterDetails()) || <CircularProgress />;
}

export default ShowDefaulters;
