import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "servicio";
class ServicioService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getServicio() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getServicioId(ServicioId) {
    
    return axios.get(BASE_URL + "/" + ServicioId);
  }


  async  get_tiempoServicio(ServicioId) {
    console.log(`Fetching reservations for user ID: ${ServicioId}`); // Debugging line
    try {
      const response = await axios.get(`${BASE_URL}/get_tiempoServicio/${ServicioId}`);
      console.log('API Response:', response.data); // Debugging line
      return response;
    } catch (error) {
      console.error('Error fetching reservations:', error); // Debugging line
    }
  }

  createServicio(Servicio) {
    console.log(Servicio);
    return axios.post(BASE_URL, Servicio);
  }

  updateServicio(Servicio) {
    console.log(Servicio);
    return axios.put(BASE_URL, Servicio);
  }
  getNextId() {
    return axios.get(BASE_URL + "/getNextId");
  }
  getTopServicios() {
    return axios.get(BASE_URL + "/getTopServicios");
  }

}
export default new ServicioService();
