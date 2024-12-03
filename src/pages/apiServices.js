import axios from "axios";

// Base URL de la API desde el archivo de entorno
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

// Configurar la instancia de Axios
const api = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    Accept: "application/json",
  },
});

// Métodos CRUD encapsulados
export const apiService = {
  getAll: (resource) => api.get(`/api/${resource}`), // Obtiene todos los elementos
  getOne: (resource, id) => api.get(`/api/${resource}/${id}`), // Obtiene un elemento por ID
  create: (resource, data) => api.post(`/api/${resource}`, data), // Crea un nuevo elemento
  update: (resource, id, data) => api.patch(`/api/${resource}/${id}`, data), // Actualiza un elemento por ID
  delete: (resource, id) => api.delete(`/api/${resource}/${id}`), // Elimina un elemento por ID
};