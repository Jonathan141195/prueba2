import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "horario";

class HorarioService {
  getHorario() {
    return axios.get(BASE_URL);
  }

  getHorarioId(HorarioId) {
    return axios.get(`${BASE_URL}/${HorarioId}`);
  }

  getProductoByOC(idProdcuto) {
    return axios.get(`${BASE_URL}/${idProdcuto}`);
  }

  getProductoByBodega(idBodega) {
    return axios.get(`${BASE_URL}/getProductoByBodega/${idBodega}`);
  }

  createHorario(Horario) {
    return axios.post(BASE_URL, Horario);
  }

  updateHorario(Horario) {
    return axios.put(BASE_URL, Horario);
  }

  getNextId() {
    return axios.get(`${BASE_URL}/getNextId`);
  }

  async getHorarioBySucursal(dia, sucursalId) {
    try {
      // Formatear la fecha como 'YYYY-MM-DD'
      const formattedDate = new Date(dia).toISOString().split('T')[0];
      const url = `${BASE_URL}/getHorarioBySucursal/${formattedDate}/${sucursalId}`;
      console.log(`Fetching horario from URL: ${url}`);
      
      const response = await axios.get(url);
      if (response.data && response.data.results) {
        return response.data.results;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error('Error fetching horarios:', error);
      throw error;
    }
  }

async getHorarioBySucursalall(dia, sucursalId) {
  try {
    // Formatear la fecha como 'YYYY-MM-DD'
    const formattedDate = new Date(dia).toISOString().split('T')[0];
    const url = `${BASE_URL}/getHorarioBySucursalall/${formattedDate}/${sucursalId}`;
    console.log(`Fetching horario from URL: ${url}`);
    
    const response = await axios.get(url);
    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error('Error fetching horarios:', error);
    throw error;
  }
}
}

export default new HorarioService();


