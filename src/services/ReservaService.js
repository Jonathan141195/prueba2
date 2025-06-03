import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "reserva";
class ReservaService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getReservas() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getReservaId(ReservaId) {
    return axios.get(BASE_URL + "/" + ReservaId);
  }
  async getReservaByUsuario(userId) {
    console.log(`Fetching reservations for user ID: ${userId}`); // Debugging line
    try {
      const response = await axios.get(`${BASE_URL}/getReservaByUsuario/${userId}`);
      console.log('API Response:', response.data); // Debugging line
      return response;
    } catch (error) {
      console.error('Error fetching reservations:', error); // Debugging line
    }
  }
  async getReservaByUsuario_login(userId) {
    console.log(`Fetching reservations for user ID: ${userId}`); // Debugging line
    try {
      const response = await axios.get(`${BASE_URL}/getReservaByUsuario_login/${userId}`);
      console.log('API Response:', response.data); // Debugging line
      return response;
    } catch (error) {
      console.error('Error fetching reservations:', error); // Debugging line
    }
  }
  async getReservaByEstado(idUsuario) {
    const url = `${BASE_URL}/getReservaByEstado/${idUsuario}`;
    console.log(`Fetching reservations for user ID: ${idUsuario}`); // Debugging line
    console.log(`API URL: ${url}`); // Debugging line
    try {
      const response = await axios.get(url);
      console.log('API Response:', response.data); // Debugging line
      return response;
    } catch (error) {
      console.error('Error fetching reservations:', error); // Debugging line
      throw error; // Re-throw the error to handle it in the calling function
    }
  }
 
   createReserva(Reserva) {
    console.log(Reserva);
    return axios.post(BASE_URL, Reserva);
  }
// Actualizar reserva
updateReserva(reserva) {
  console.log(reserva);
  return axios.put(BASE_URL, reserva);
}


async getReservaByUsuarioFecha($dia_semana, $id_Usuario) {
  try {
    const formattedDate = new Date($dia_semana).toISOString().split('T')[0];
    const url = `${BASE_URL}/getReservaByUsuariodate/${formattedDate}/${$id_Usuario}`;
    
    // Debugging line to print the URL
    console.log('Request URL:', url);
    
    const response = await axios.get(url);
    console.log('API Response:', response.data); // Debugging line
    return response;
  } catch (error) {
    console.error('Error fetching reservations:', error); // Debugging line
  }
}
    async getFacturabydate($fecha)
    { {
   
    try {
      const formattedDate = new Date($fecha).toISOString().split('T')[0];
    
      const response = await axios.get(`${BASE_URL}/getReservabydate/${formattedDate}`);
      console.log('API Response:', response.data); // Debugging line
      return response;
    } catch (error) {
      console.error('Error fetching reservations:', error); // Debugging line
    }
  }
  
  
}

}
export default new ReservaService();
