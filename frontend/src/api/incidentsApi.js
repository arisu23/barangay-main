import axios from "axios";

const base = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api" });

export const getIncidents = () => base.get("/incidents");
export const createIncident = (data) => base.post("/incidents", data);
export const updateIncident = (id, data) => base.put(`/incidents/${id}`, data);
export const deleteIncident = (id) => base.delete(`/incidents/${id}`);
