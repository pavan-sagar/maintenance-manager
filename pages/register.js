import React, { useState, useEffect } from "react";
import { axios } from "../config";
import Router from "next/router";

export default function Register(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [pincode, setPincode] = useState();
  const [area, setArea] = useState();
  const [wing, setWing] = useState();
  const [flatNo, setFlatNo] = useState();
  const [validationErr, setValidationErr] = useState();

  const getSocietyNames = () => {
    return props.societies.map((society) => (
      <option value={society.name}>{society.name}</option>
    ));
  };

  const getPincodes = () => {
    if (societyName) {
      const pincodes = props.societies.filter(
        (society) => society.name === societyName
      );
      return pincodes.map(({ pincode }) => (
        <option value={pincode}>{pincode}</option>
      ));
    }
  };
  const getAreas = () => {
    if (societyName && pincode) {
      const areas = props.societies
        .filter((society) => society.name === societyName)
        .filter((society) => society.pincode === pincode);

      return areas.map(({ area }) => <option value={area}>{area}</option>);
    }
  };

  const getWings = () => {
    if (societyName && pincode && area) {
      const societies = props.societies
        .filter((society) => society.name === societyName)
        .filter((society) => society.pincode === pincode)
        .filter((society) => society.area === area);

      return societies.map((society) =>
        society.wings.map((wing) => <option value={wing}>{wing}</option>)
      );
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationErr("Passwords do not match");
    } else {
      try {
        const response = await axios.post("/add/resident", {
          name: `${firstName} ${lastName}`,
          email,
          password,
          societyName,
          pincode,
          area,
          wing,
          flatNo,
          buildingID: `${wing}-${societyName}-${pincode}`,
          flatID: `${pincode}-${societyName}-${wing}-${flatNo}`,
        });
        if (response.status === 200) {
          alert(
            "You have successfully registered. Kindly sign in to continue."
          );
          Router.push("/signin");
        }
      } catch (e) {
        if (e.response.status === 400) {
          setValidationErr(e.response.data);
        } else {
          console.log({ e });
        }
      }
    }
  };

  return (
    <div className="h-screen flex flex-col justify-start items-center ">
      <p className="mt-2">
        <i>Create an account</i>
      </p>
      <form
        className="grid grid-cols-2 grid-rows-5 gap-y-5 px-2 mt-5"
        onSubmit={onFormSubmit}
      >
        <label htmlFor="firstName">First Name</label>
        <input
          className="border-2 rounded-md"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          className="border-2 rounded-md"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          type="text"
          required
        />
        <label htmlFor="society">Society</label>

        <select
          name="society"
          className="border-2 rounder-md"
          value={societyName}
          onChange={(e) => setSocietyName(e.target.value)}
          required
        >
          <option value="" selected>
            Choose society
          </option>
          {getSocietyNames()}
        </select>
        {societyName && (
          <>
            <label htmlFor="pincode">Pincode</label>

            <select
              name="pincode"
              className="border-2 rounder-md"
              value={pincode}
              onChange={(e) => setPincode(Number(e.target.value))}
              required
            >
              <option value="" selected>
                Choose Pincode
              </option>

              {getPincodes()}
            </select>
          </>
        )}

        {societyName && pincode && (
          <>
            <label htmlFor="area">Area</label>

            <select
              name="area"
              className="border-2 rounder-md"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            >
              <option value="" selected>
                Choose area
              </option>

              {getAreas()}
            </select>
          </>
        )}

        {societyName && pincode && area && (
          <>
            <label htmlFor="wings">Wing</label>

            <select
              name="wings"
              className="border-2 rounder-md"
              value={wing}
              onChange={(e) => setWing(e.target.value)}
              required
            >
              <option value="" selected disabled>
                Choose Wing
              </option>

              {getWings()}
            </select>

            <label htmlFor="flat">Flat No.</label>

            <input
              type="text"
              name="flat"
              className="border-2 rounder-md"
              value={flatNo}
              onChange={(e) => setFlatNo(e.target.value)}
              required
            />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input
          className="border-2 rounded-md"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          className="border-2 rounded-md"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="Password must contain minimum of 8 characters with atleast 1 Uppercase letter, 1 lowercase letter, 1 number and a special character"
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          className="border-2 rounded-md"
          name="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          required
        />
        {validationErr && (
          <p className="col-span-2 text-red-600 font-bold justify-self-end">{`*${validationErr}`}</p>
        )}
        <button
          className="col-span-2 bg-blue-600 text-white hover:bg-[#3f83f8] rounded-md py-3 inline-block focus:outline-none focus:ring focus-border-blue-600"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const { data } = await axios("get/societies");

  let societies = data.map((society) => {
    return {
      name: society.name,
      wings: society.wings,
      area: society.area,
      pincode: society.pincode,
    };
  });

  return {
    props: {
      societies,
    },
  };
};
