import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../config";

function ManageBuilding() {
  const adminEmail = useSelector((state) => state.authenticate.userId);
  const [isManagerOfBuilding, setIsManagerOfBuilding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    try {
      const { data } = await axios.get("get/building", {
        params: {
          managerEmail: adminEmail,
        },
      });

      if (data) {
        setIsManagerOfBuilding(true);
      }
    } catch (error) {}

    setIsLoading(false);
  }, []);
  return (
    (!isLoading && (
      <div className="outer-border">
        {(isManagerOfBuilding && <span>You are manager</span>) || (
          <span>No building is managed by you.</span>
        )}
      </div>
    )) ||
    "Loading..."
  );
}

export default ManageBuilding;
