import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "proveedor";
class ProveedorService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getProveedores() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getProveedorId(ProveedorId) {
    return axios.get(BASE_URL + "/" + ProveedorId);
  }

  createProveedor(Proveedor) {
    return axios.post(BASE_URL, Proveedor);
  }

  updateProveedor(ProveedorId, Proveedor) {
    return axios.put(BASE_URL + "/" + ProveedorId, Proveedor);
  }

}
export default new ProveedorService();
