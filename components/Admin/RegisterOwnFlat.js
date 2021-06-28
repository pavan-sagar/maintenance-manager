import { capitalize } from "../../utilities";
import { useState, useEffect } from "react";
import { axios } from "../../config";
import ToastMessage from "../lib/ToastMessage";
import { useSelector } from "react-redux";

function RegisterOwnFlat() {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [submitErr, setSubmitErr] = useState("");
  const email = useSelector((state) => state.authenticate.userId);

  //Fetch all societies on intial render
  useEffect(async () => {
    const { data, status } = await axios.get("get/societies");

    if (status == 200) {
      setSocieties(data);
      setIsLoading(false);
    } else {
      alert("An error occured. Please try again.");
    }
  }, []);

  //Clear choosen building when selected society is changed
  useEffect(() => {
    setSelectedBuilding("");
  }, [selectedSociety]);

  const renderSocieties = () => {
    return societies.map((society) => (
      <option
        value={`${society.name}-${society.pincode}`}
        key={`${society.name}-${society.pincode}`}
      >
        {capitalize(`${society.name} - ${society.pincode}`)}
      </option>
    ));
  };

  const renderBuildings = () => {
    return societies
      .find((society) => {
        const [name, pincode] = selectedSociety.split("-");
        return society.name === name && society.pincode == pincode;
      })
      ?.wings.map((wing) => <option value={wing}>{wing}</option>);
  };

  const registerFlat = async (e) => {
    e.preventDefault();

    const societyName = selectedSociety.split("-")[0];
    const wing = selectedBuilding;
    const flatNo = Number(e.target.flatNo.value);
    const pincode = Number(selectedSociety.split("-")[1]);
    const societyID = selectedSociety;
    const buildingID = selectedBuilding + "-" + selectedSociety;
    const flatID = flatNo + "-" + buildingID;

    try {
      const { data, status } = await axios.patch("update/resident", {
        societyName,
        wing,
        flatNo,
        pincode,
        societyID,
        flatID,
        email,
        buildingID,
      });

      if (status == 200) {
        setRegisteredSuccess(true);
      }
    } catch (e) {
      setRegisteredSuccess(false);

      //Flat was already registered before.
      if (e.response.status == 422) {
        setSubmitErr(e.response.data);
      } else {
        alert("An error has occured. Please try again");
      }
    }
  };

  return (
    (!isLoading && (
      <div className="inline-block">
        <div className="border-2 rounder-md shadow-md inline-block p-2">
          <span className="font-normal italic">
            You can enroll as a resident by registering your flat.
          </span>
          <form
            className="mt-5 grid grid-cols-2 gap-y-3"
            method="POST"
            onSubmit={registerFlat}
          >
            <label htmlFor="choose-society">Society</label>
            <select
              name="society"
              id="choose-society"
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose Society
              </option>
              {renderSocieties()}
            </select>
            <label htmlFor="choose-building">Building</label>
            <select
              name="building"
              id="choose-building"
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose Building
              </option>

              {renderBuildings()}
            </select>
            <label htmlFor="flat-no">Flat No.</label>
            <input type="number" name="flatNo" id="flat-no" required />
            <div className="col-span-2">
              <button
                className="mt-5"
                type="submit"
              >
                Register flat
              </button>
              {submitErr && (
                <span className="text-red-500 font-medium mt-5">
                  {submitErr}
                </span>
              )}
            </div>
          </form>
        </div>
        {registeredSuccess && (
          <ToastMessage duration={3} success={true}>
            Flat registered as a resident successfully.
          </ToastMessage>
        )}
      </div>
    )) ||
    "Loading..."
  );
}

export default RegisterOwnFlat;
