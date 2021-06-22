import { capitalize } from "../../utilities";
import { useState, useEffect } from "react";
import { axios } from "../../config";

function RegisterOwnFlat() {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  //Fetch all societies on intial render
  useEffect(async () => {
    const { data, status } = await axios.get("get/societies");

    if (status == 200) {
      setSocieties(data);
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

  return (
    <div className="border-2 inline-block p-2">
      You can enroll as a resident by registering your flat.
      <form className="mt-5 grid grid-cols-2">
        <label htmlFor="choose-society">Society</label>
        <select
          name="society"
          id="choose-society"
          value={selectedSociety}
          onChange={(e) => setSelectedSociety(e.target.value)}
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
        >
          <option value="" disabled>
            Choose Building
          </option>

          {renderBuildings()}
        </select>
        <button
          className="mt-5 col-span-2 w-full bg-blue-600 text-white hover:bg-[#3f83f8] rounded-md py-3 inline-block focus:outline-none focus:ring focus-border-blue-600"
          type="submit"
        >
          Register flat
        </button>
      </form>
    </div>
  );
}

export default RegisterOwnFlat;
