import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import { capitalize } from "../../utilities";

const columns = [
  { field: "id", headerName: "Sr No" },
  { field: "flatNo", headerName: "Flat No" },
  { field: "amount", headerName: "Amount" },
  { field: "date", headerName: "Date" },
  { field: "mainPeriod", headerName: "Maintenance Period" },
  { field: "ownerName", headerName: "Owner Name" },
];

const rows = [
  {
    id: "1",
    flatNo: "101",
    amount: 5000,
    date: "www",
    mainPeriod: "eeee",
    ownerName: "ddd",
  },
];

function ResidentTransactions() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isLoading, setIsLoading] = useState(true);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);
  const [building, setBuilding] = useState("");
  const [society, setSociety] = useState("");

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
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  });

  const renderResidentsTransactions = () => {
    return (
      <div>
        <div className="grid grid-cols-2 w-max">
          <label className="w-max">Society: </label>
          <span>{society}</span>
          <label className="w-max">Building : </label>
          <span>{building}</span>
        </div>
        <div className="h-[400px] w-full">
          <DataGrid columns={columns} rows={rows} pageSize={20} />
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
