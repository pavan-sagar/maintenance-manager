import { DataGrid } from "@material-ui/data-grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import { capitalize } from "../../utilities";

const columns = [
  { field: "id", headerName: "Sr No", flex: 0.3 },
  { field: "flatNo", headerName: "Flat No", flex: 0.3 },
  { field: "ownerName", headerName: "Owner Name", flex: 0.5 },
  { field: "email", headerName: "Email ID", flex: 0.5 },
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

function ResidentsDetails() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isLoading, setIsLoading] = useState(true);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);
  const [building, setBuilding] = useState("");
  const [society, setSociety] = useState("");

  const classes = useStyles();

  useEffect(async () => {
    try {
      const { data, status } = await axios.get("/get/building", {
        params: {
          managerEmail: adminEmail,
        },
      });

      if (data) {
        setIsManagerOfBuilding(true);
        setBuilding(capitalize(data.buildingID.split("-")[0]));
        setSociety(capitalize(data.buildingID.split("-")[1]));
      }
      //Fetch residents details of the managed building

      const response = await axios.get("/get/residents", {
        params: {
          buildingID: data.buildingID,
        },
      });

      if (response.data) {
        console.log(response.data);
        response.data.map((resident, idx) => {
          rows.push({
            id: idx + 1,
            ownerName: resident.name,
            email: resident.email,
            flatNo: resident.flatNo,
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  }, []);

  const renderResidentsDetails = () => {
    return (
      <div>
        <span className="block text-center mb-9 text-xl font-medium">
          Residents Details
        </span>
        <div className="grid grid-cols-2 w-max">
          <label className="w-max font-semibold">Society: </label>
          <span className="italic">{society}</span>
          <label className="w-max font-semibold">Building : </label>
          <span className="italic">{building}</span>
        </div>
        <div
          style={{
            height: 400,
            width: "100%",
            marginTop: "1.5rem",
            overflow: "scroll",
          }}
        >
          <DataGrid
            className={classes.root}
            columns={columns}
            rows={rows}
            pageSize={5}
          />
        </div>
      </div>
    );
  };

  return (
    (!isLoading && <div>{renderResidentsDetails()}</div>) || (
      <CircularProgress />
    )
  );
}

export default ResidentsDetails;
