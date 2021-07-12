import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import { capitalize } from "../../utilities";
import ToastMessage from "../lib/ToastMessage";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function ManageBuilding() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [buildingData, setBuildingData] = useState({});
  const [managedSociety, setManagedSociety] = useState("");
  const [managedBuilding, setManagedBuilding] = useState("");
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showDeregisterDialog, setShowDeregisterDialog] = useState(false);

  useEffect(async () => {
    try {
      const { data } = await axios.get("get/building", {
        params: {
          managerEmail: adminEmail,
        },
      });

      if (data) {
        setIsManagerOfBuilding(true);
        setBuildingData(data);
        setManagedSociety(
          capitalize(
            data.buildingID.split("-")[1] +
              " - " +
              data.buildingID.split("-")[2]
          )
        );
        setManagedBuilding(capitalize(data.buildingID.split("-")[0]));
      } else {
        //Get list of societies so that a new building can be chosen to manage.

        try {
          const { data, status } = await axios.get("/get/societies");
          if (status === 200) {
            setSocieties(data);
          }
        } catch (e) {
          console.log("An error occured.");
        }
      }
    } catch (error) {}

    setIsLoading(false);
  }, []);

  const renderBuildingData = () => {
    return (
      <div>
        <form
          className="grid grid-cols-2 gap-x-10 gap-y-2"
          onSubmit={updateBuilding}
        >
          <span className="col-span-2 italic font-medium text-lg text-center mb-5">
            Edit Building Data
          </span>
          <label htmlFor="society">Society</label>
          <input type="text" id="society" value={managedSociety} disabled />
          <label htmlFor="building">Building</label>
          <input type="text" id="building" value={managedBuilding} disabled />
          <label htmlFor="chairman">Chairman</label>
          <input
            type="text"
            id="chairman"
            name="chairman"
            defaultValue={buildingData.chairman}
            pattern="^[a-zA-Z ]*$"
            title="Only letters and spaces are allowed."
            required
          />
          <label htmlFor="maintenance-per-month">Maintenance Per Month</label>
          <input
            type="number"
            id="maintenance-per-month"
            name="maintenancePerMonth"
            defaultValue={Number(buildingData.maintenancePerMonth)}
            required
          />
          <label htmlFor="collect-after-months">Collect After Months</label>
          <input
            type="number"
            id="collect-after-months"
            name="collectAfterHowManyMonths"
            min={1}
            max={12}
            defaultValue={Number(buildingData.collectAfterHowManyMonths)}
            required
          />
          <label htmlFor="collection-order">Collection Order</label>
          <select
            id="collection-order"
            name="collectionOrder"
            value={buildingData.collectionOrder}
          >
            <option value="Prepaid">Prepaid</option>
            <option value="Postpaid">Postpaid</option>
          </select>
          <label htmlFor="due-day">Due Day</label>
          <input
            type="number"
            defaultValue={Number(buildingData.dueDay)}
            name="dueDay"
            min={1}
            max={27}
            required
          />
          <label htmlFor="main-start-period">Maintenance Start Period</label>
          <input
            type="number"
            id="main-start-period"
            name="mainStartPeriod"
            min={1}
            max={12}
            defaultValue={Number(buildingData.mainStartPeriod)}
            required
          />
          <label htmlFor="main-start-Year">Maintenance Start Year</label>
          <input
            type="number"
            id="main-start-Year"
            name="mainStartYear"
            min={1970}
            max={9999}
            defaultValue={Number(buildingData.mainStartYear)}
            required
          />
          <button type="submit" className="col-span-2 mt-5">
            Make Changes
          </button>
          <button
            type="button"
            className="col-span-2 mt-5 bg-red-600 hover:bg-red-500"
            onClick={() => setShowDeregisterDialog(true)}
          >
            Deregister
          </button>
          <Dialog
            open={showDeregisterDialog}
            onClose={() => setShowDeregisterDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Deregister your managed building ?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <span>
                  Are you sure you want to deregister the building{" "}
                  <i>
                    <strong>
                      {managedBuilding}-{managedSociety}
                    </strong>
                  </i>{" "}
                  that is managed by you ?
                </span>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={deregisterBuilding} color="primary">
                Confirm
              </Button>
              <Button
                onClick={() => setShowDeregisterDialog(false)}
                color="primary"
                autoFocus
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </div>
    );
  };

  const updateBuilding = async (e) => {
    e.preventDefault();

    const modifiedBuildingData = {
      chairman: e.target.chairman.value,
      maintenancePerMonth: Number(e.target.maintenancePerMonth.value),
      collectAfterHowManyMonths: Number(
        e.target.collectAfterHowManyMonths.value
      ),
      collectionOrder: e.target.collectionOrder.value,
      dueDay: Number(e.target.dueDay.value),
      mainStartPeriod: Number(e.target.mainStartPeriod.value),
      mainStartYear: Number(e.target.mainStartYear.value),
      buildingID: buildingData.buildingID,
    };

    try {
      const { data, status } = await axios.patch(
        "/update/building",
        modifiedBuildingData
      );
      if (status === 200) {
        setShowToastMessage(true);
        setToastMessage("Building data updated successfully.");
        setTimeout(() => setShowToastMessage(false), 3500);
      }
    } catch (e) {
      alert("An error occured. Please try again.");
    }
  };

  //De-link/de-register the building that is being managed currently.
  const deregisterBuilding = async () => {
    try {
      const { status } = await axios.patch("/update/building", {
        buildingID: buildingData.buildingID,
        managerEmail: "",
      });

      if (status === 200) {
        setShowToastMessage(true);
        setToastMessage("Building de-registered successfully.");
        setTimeout(() => setShowToastMessage(false), 3500);
      }
    } catch (e) {
      alert("An error occured. Please try again.");
    }
    setShowDeregisterDialog(false);
  };

  //No building is current being managed. Register new building for management.
  const manageNewBuilding = () => {
    return (
      <div>
        <p className="text-lg">Manage New Building</p>
        <span className="font-light text-sm italic">
          (Currently, no building is managed by you)
        </span>

        <form
          className="grid grid-cols-2 gap-y-2"
          onSubmit={submitManageNewBuilding}
        >
          <label htmlFor="society">Society</label>
          <select
            id="society"
            name="society"
            defaultValue=""
            onChange={(e) => setSelectedSociety(e.target.value)}
            required
          >
            <option value="" disabled>
              Select
            </option>
            {societies.map((society) => (
              <option value={`${society.name}-${society.pincode}`}>
                {capitalize(`${society.name}-${society.pincode}`)}
              </option>
            ))}
          </select>
          <label htmlFor="building">Building</label>

          <select
            id="building"
            defaultValue=""
            className="justify-self-start"
            required
          >
            <option value="" disabled>
              Select
            </option>
            {societies
              .find((society) => {
                return (
                  society.name === selectedSociety.split("-")[0] &&
                  society.pincode == selectedSociety.split("-")[1]
                );
              })
              ?.wings.map((wing) => (
                <option value={wing}>{capitalize(wing)}</option>
              ))}
          </select>
          <button className="col-span-2" type="submit">
            Manage New Building
          </button>
        </form>
      </div>
    );
  };

  //New building to manage form submission
  const submitManageNewBuilding = async (e) => {
    e.preventDefault();
    const societyID = e.target.society.value;
    const building = e.target.building.value.toLowerCase();
    const buildingID = `${building}-${societyID}`;

    try {
      const { data, status } = await axios.patch("update/building", {
        buildingID,
        managerEmail: adminEmail,
      });

      if (status === 200) {
        setShowToastMessage(true);
        setToastMessage("Building added for management.");
        setTimeout(() => setShowToastMessage(false), 3500);
      }
    } catch (e) {
      console.log("An error occured.");
    }
  };
  return (
    (!isLoading && (
      <div className="outer-border inline-block p-5">
        {(isManagerOfBuilding && renderBuildingData()) || manageNewBuilding()}
        {showToastMessage && (
          <div className="mt-5">
            <ToastMessage success={true} duration={3}>
              {toastMessage}
            </ToastMessage>
          </div>
        )}
      </div>
    )) ||
    "Loading..."
  );
}

export default ManageBuilding;
