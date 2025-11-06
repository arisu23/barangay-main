import axios from "axios";

const base = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api" });

export const getHouseholds = () => base.get("/households");
export const createHousehold = (data) => base.post("/households", data);
export const updateHousehold = (id, data) => base.put(`/households/${id}`, data);
export const deleteHousehold = (id) => base.delete(`/households/${id}`);
