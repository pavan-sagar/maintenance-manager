import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import ToastMessage from "../lib/ToastMessage";
import { capitalize } from "../../utilities";

function CreateBuilding() {
  const [societyError, setSocietyError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [societies, setSocieties] = useState("");
  const adminEmail = useSelector((state) => state.authenticate.userId);

  //Fetch list of societies registered by admin on initial load
  useEffect(async () => {
    const { data, status } = await axios.get("get/societies");
    setIsLoading(false);
    if (status != 200) {
      alert("An error has occured.");
    }
    if (data.length) {
      const managesSociety = data.filter(
        (society) => society.adminEmail === adminEmail
      );
      if (managesSociety.length) {
        setSocieties(managesSociety);
      } else {
        setSocieties("");
      }
    }
  }, []);

  //Render list of societies
  const getSocieties = () => {
    if (societies.length) {
      return (
        <>
          <label htmlFor="select-society">Society</label>
          <div className="inline-block">
            <select name="society" id="select-society">
              <option value="" selected disabled>
                Choose Society
              </option>
              {societies.map((society) => (
                <option
                  value={`${society.name}-${society.pincode}`}
                  key={society.societyID}
                >
                  {`${capitalize(society.name)}(${society.pincode})`}
                </option>
              ))}
            </select>
            {societyError && (
              <p className="text-red-600 font-medium">{societyError}</p>
            )}
          </div>
        </>
      );
    } else {
      return (
        <span className="text-center col-span-2">
          No society has been registered by you.
        </span>
      );
    }
  };

  const createNewBuilding = async (e) => {
    e.preventDefault();
    const societyID = e.target.society.value.toLowerCase();

    if (!societyID) {
      setSocietyError("Please select a society.");
      return null;
    } else {
      setSocietyError("");
    }

    const wings = e.target.building.value.toLowerCase();

    const wingsArr = [];

    //When multiple building/wing names are given separated by comma, split and trim them of trailing spaces
    wings.split(",").map((wing) => {
      if (wing.length) {
        wingsArr.push(wing.trim());
      }
    });

    const { data, status } = await axios.post("update/society", {
      societyID,
      wingsArr,
    });

    if (status == 200) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
      alert("An error has occured. Please try again.");
    }
  };
  return (
    (!isLoading && (
      <div className="justify-self-start self-start w-full sm:w-max">
        <div className="border-2 rounded-md shadow-md">
          <form
            className="grid grid-cols-2 w-full gap-y-3 justify-items-start p-5"
            method="POST"
            onSubmit={createNewBuilding}
          >
            {getSocieties()}

            <label htmlFor="building">Building Name: </label>
            <input
              type="text"
              id="building"
              name="building"
              className="border-2 rounded-md w-full"
            />
            {societies && (
              <button
                className="mt-5 col-span-2 w-full bg-blue-600 text-white hover:bg-[#3f83f8] rounded-md py-3 inline-block focus:outline-none focus:ring focus-border-blue-600"
                type="submit"
              >
                Create Building
              </button>
            )}
          </form>
        </div>
        {submitted && (
          <div className="mt-10 justify-self-center mx-auto">
            <ToastMessage success={true} duration={4}>
              <span>Building(s) added successfully to Society.</span>
            </ToastMessage>
          </div>
        )}
      </div>
    )) ||
    "Loading..."
  );
}

export default CreateBuilding;
