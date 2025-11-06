import axios from "axios";

const base = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api" });

export const getDocuments = () => base.get("/documents");
export const getDocument = (id) => base.get(`/documents/${id}`);
export const createDocument = (payload) => base.post("/documents", payload);
export const updateDocument = (id, payload) => base.put(`/documents/${id}`, payload);
export const deleteDocument = (id) => base.delete(`/documents/${id}`);
