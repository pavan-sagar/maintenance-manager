import React, { useState, useEffect } from "react";
import { axios } from "../config";
import Router from "next/router";
import { motion } from "framer-motion";

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
  const [registerAsAdmin, setRegisterAsAdmin] = useState(false);

  //Reset Pincode, areas and wings to default when societyName is changed
  useEffect(() => {
    setPincode("");
    setArea("");
    setWing("");
  }, [societyName]);

  //Reset Areas and wings to default when Pincode is changed
  useEffect(() => {
    setArea("");
    setWing("");
  }, [pincode]);

  //Reset Wings to default when Area is changed
  useEffect(() => {
    setWing("");
  }, [area]);

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
      return pincodes.map(({ pincode }, idx) => (
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
        const postData = {
          name: `${firstName} ${lastName}`,
          email,
          password,
          isAdmin: registerAsAdmin,
        };

        if (!registerAsAdmin) {
          postData.societyName = societyName;
          postData.pincode = pincode;
          postData.area = area;
          postData.wing = wing;
          postData.flatNo = flatNo;
          postData.buildingID = buildingID;
          postData.flatID = flatID;
        }

        const response = await axios.post("/add/resident", postData);
        if (response.status === 200) {
          alert(
            `${response.data} Kindly sign in to continue.`
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
    <div className="h-max flex flex-col justify-start items-center border-2 rounded-md shadow-md w-[95%] md:w-max">
      <p className="mt-2">
        <i className="font-semibold italic">Create an account</i>
      </p>
      <form
        className="grid grid-cols-2 grid-rows-5 gap-y-5 px-2 mt-5"
        onSubmit={onFormSubmit}
      >
        {console.log(registerAsAdmin)}
        <div className="col-span-2 justify-self-start">
          <input
            type="checkbox"
            name="registerAsAdmin"
            value={registerAsAdmin}
            checked={registerAsAdmin}
            onChange={() => setRegisterAsAdmin((prevVal) => !prevVal)}
          />
          <span className="inline-block ml-5">Register As Admin</span>
        </div>
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
        {!registerAsAdmin && (
          <>
            <label htmlFor="society">Society</label>

            <select
              name="society"
              className="border-2 rounder-md"
              value={societyName}
              onChange={(e) => setSocietyName(e.target.value)}
              required
            >
              <option value="" selected disabled>
                Choose society
              </option>
              {getSocietyNames()}
            </select>

            <label htmlFor="pincode">Pincode</label>

            <select
              name="pincode"
              className="border-2 rounder-md"
              value={pincode}
              onChange={(e) => setPincode(Number(e.target.value))}
              required
            >
              <option value="" selected disabled>
                Choose Pincode
              </option>

              {getPincodes()}
            </select>

            <label htmlFor="area">Area</label>

            <select
              name="area"
              className="border-2 rounder-md"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            >
              <option value="" selected disabled>
                Choose area
              </option>

              {getAreas()}
            </select>

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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{
            scale: 0.95,
            transition: { type: "spring", stiffness: 75 },
          }}
          className="mb-5 col-span-2"
          type="submit"
        >
          Submit
        </motion.button>
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
