import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";

function ManageBuilding() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buildingData, setBuildingData] = useState({});

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
      }
    } catch (error) {}

    setIsLoading(false);
  }, []);

  const renderBuildingData = () => {
    return (
      <form
        className="grid grid-cols-2 gap-x-10 gap-y-2"
        onSubmit={updateBuilding}
      >
        <span className="col-span-2 italic font-medium text-lg text-center mb-5">
          Edit Building Data
        </span>
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
      </form>
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
      const { data, status } = await axios.post(
        "/update/building",
        modifiedBuildingData
      );
      if (status === 200) {
        alert("Building modified.");
      }
    } catch (e) {
      alert("An error occured. Please try again.");
    }
  };
  return (
    (!isLoading && (
      <div className="outer-border inline-block p-5">
        {(isManagerOfBuilding && renderBuildingData()) || (
          <span>No building is managed by you.</span>
        )}
      </div>
    )) ||
    "Loading..."
  );
}

export default ManageBuilding;
