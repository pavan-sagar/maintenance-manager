import { makeStyles } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import { capitalize, getMonthName } from "../../utilities";

const columns = [
  { field: "id", headerName: "Sr No", flex: 0.4 },
  { field: "flatNo", headerName: "Flat No", flex: 0.5 },
  { field: "amount", headerName: "Amount", flex: 0.5 },
  { field: "date", headerName: "Date", flex: 0.5 },
  { field: "mainPeriod", headerName: "Maintenance Period", flex: 0.8 },
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

function ResidentTransactions() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isLoading, setIsLoading] = useState(true);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);
  const [building, setBuilding] = useState("");
  const [society, setSociety] = useState("");
  const [buildingTransactions, setBuildingTransactions] = useState([]);

  const classes = useStyles();

  //Check if any building is being managed by the Admin
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

        //Fetch transactions of all the flats of the managed building
        const response = await axios.get("/get/building_transactions", {
          params: {
            buildingID: data.buildingID,
          },
        });

        //Fill the grid rows with transaction data
        response.data &&
          response.data.map((trx, idx) => {
            rows.push({
              id: idx + 1,
              flatNo: trx.flatID.split("-")[0],
              amount: trx.amount,
              date: new Date(trx.createdAt).toLocaleDateString(),
              mainPeriod: `${getMonthName(trx.period[0] - 1, 3)}
              ${
                trx.period[0] != trx.period[trx.period.length - 1]
                  ? ` to ${getMonthName(
                      trx.period[trx.period.length - 1] - 1,
                      3
                    )}`
                  : ""
              } ${trx.year}`,
            });
          });
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  }, []);

  const renderResidentsTransactions = () => {
    return (
      <div>
        <span className="block text-center mb-9 text-xl font-medium">
          Maintenance payment transactions
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
    (!isLoading && (
      <div>
        {(isManagerOfBuilding && renderResidentsTransactions()) || (
          <p>
            No building is managed by you. Kindly set a building for management.
          </p>
        )}
      </div>
    )) || <p>Loading...</p>
  );
}

export default ResidentTransactions;
