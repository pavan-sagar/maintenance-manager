import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";
import { capitalize } from "../../utilities";

function ResidentsDetails() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isLoading, setIsLoading] = useState(true);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);
  const [building, setBuilding] = useState("");
  const [society, setSociety] = useState("");

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

        //Fetch residents details of the managed building
        const response = await axios.get("/get/residents", {
          params: {
            buildingID: data.buildingID,
          },
        });

        console.log(response.data);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  }, []);

  return <div>Residents Details</div>;
}

export default ResidentsDetails;
