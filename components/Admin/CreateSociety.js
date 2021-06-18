import { useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import ToastMessage from "../lib/ToastMessage";

function CreateSociety() {
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const adminEmail = useSelector((state) => state.authenticate.userId);

  const createNewSociety = async (e) => {
    e.preventDefault();
    const name = e.target.societyName.value.toLowerCase();
    const area = e.target.area.value.toLowerCase();
    const pincode = e.target.pincode.value;

    const { data, status } = await axios.get(
      `get/societies`,

      {
        params: {
          name,
          area,
          pincode,
          societyID: `${name}-${pincode}`,
          adminEmail,
          createSociety: true,
        },
      }
    );

    if (data.includes("already exists")) {
      setError(data);
      setSubmitted(false);
    } else {
      setError("");
      setSubmitted(true);
    }
  };
  return (
    <div className="justify-self-start self-start w-full sm:w-max">
      <div className="border-2 rounded-md shadow-md">
        <form
          className="grid grid-cols-2 w-full gap-y-3 justify-items-start p-5"
          method="POST"
          onSubmit={createNewSociety}
        >
          <label htmlFor="societyName">Society Name</label>
          <input
            type="text"
            name="societyName"
            className="border-2 rounded-md w-full"
          />
          <label htmlFor="area">Area</label>

          <input
            type="text"
            name="area"
            className="border-2 rounded-md w-full"
          />
          <label htmlFor="pincode">Pincode</label>

          <input
            type="number"
            name="pincode"
            min={100000}
            max={999999}
            className="border-2 rounded-md w-full"
          />
          <button
            className="mt-5 col-span-2 w-full bg-blue-600 text-white hover:bg-[#3f83f8] rounded-md py-3 inline-block focus:outline-none focus:ring focus-border-blue-600"
            type="submit"
          >
            Create Society
          </button>
          {error && (
            <span className="col-span-2 text-red-600 font-medium">{error}</span>
          )}
        </form>
      </div>
      {submitted && (
        <div className="mt-10 justify-self-center mx-auto">
          <ToastMessage success={true} duration={2}>
            <span>Society Created Successfully !</span>
          </ToastMessage>
        </div>
      )}
    </div>
  );
}

export default CreateSociety;
