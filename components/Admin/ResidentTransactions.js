import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";

function ResidentTransactions() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isLoading, setIsLoading] = useState(true);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);

  //Check if any building is being managed by the Admin
  useEffect(async () => {
    const { data, status } = await axios.get("/get/building", {
      params: {
        managerEmail: adminEmail,
      },
    });

    if (data) {
      setIsManagerOfBuilding(true);
    }
    setIsLoading(false);
  });
  return (
    (!isLoading && (
      <div>
        {(isManagerOfBuilding && <p>Here are the transactions:</p>) || (
          <p>
            No building is managed by you. Kindly set a building for management.
          </p>
        )}
      </div>
    )) || <p>Loading...</p>
  );
}

export default ResidentTransactions;
