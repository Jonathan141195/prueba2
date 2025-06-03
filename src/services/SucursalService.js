import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "sucursal";
class SucursalService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getSucursal() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getSucursalId(SucursalId) {
    return axios.get(BASE_URL + "/" + SucursalId);
  }

  createSucursal(Sucursal) {
    return axios.post(BASE_URL, Sucursal);
  }
  getNextId() {
    return axios.get(BASE_URL + "/getNextId");
  }

  updateSucursal(Sucursal) {
    return axios.put(BASE_URL, Sucursal);
  }
  getSucursalbyEncargado($encargado_id) {
    return axios.get(`${BASE_URL}/getSucursalbyEncargado/${$encargado_id}`);
  }
  getCitasbySucursal() {
    return axios.get(BASE_URL+ "/getCitasbySucursal");
  }
}
export default new SucursalService();
