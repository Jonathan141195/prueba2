import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "rol";
class RolService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getRoles() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getRolId(RolId) {
    return axios.get(BASE_URL + "/" + RolId);
  }

}
export default new RolService();