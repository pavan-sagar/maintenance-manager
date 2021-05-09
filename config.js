import axiosInstance from "axios";

export const axios = axiosInstance.create({
  baseURL: "http://localhost:3001/api/",
  withCredentials: true,
});
