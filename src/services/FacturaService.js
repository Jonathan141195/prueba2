import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "factura";
class OrdenCompraService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  async getfactura() {
    
    try {
      const url = `${BASE_URL}`;
      console.log(`Fetching facturas from URL: ${url}`);

      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error('Error fetching facturas by usuario:', error);
      throw error;
    }
  }

  async getFacturabyusuario(idUsuario) {
    try {
      const url = `${BASE_URL}/getFacturabyusuario/${idUsuario}`;
      console.log(`Fetching facturas from URL: ${url}`);

      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error('Error fetching facturas by usuario:', error);
      throw error;
    }
  }

  async getFacturabyUsuariofecha(id_Usuario, fecha) {
    try {
      const formattedDate = new Date(fecha).toISOString().split('T')[0];
      const url = `${BASE_URL}/getFacturabyUsuariofecha/${formattedDate}/${id_Usuario}`;
      console.log(`Fetching facturas from URL: ${url}`);

      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error('Error fetching facturas by usuario and fecha:', error);
      throw error;
    }
  }
  getFacturaById(OCid) {
    return axios.get(BASE_URL + "/" + OCid);
  }

 
  async getFacturabyfecha(fecha){
    try {
      const formattedDate = new Date(fecha).toISOString().split('T')[0];
      const url = `${BASE_URL}/getFacturabyfecha/${formattedDate}`;
      console.log(`Fetching facturas from URL: ${url}`);

      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error('Error fetching facturas by usuario and fecha:', error);
      throw error;
    }
  }
  
  createFactura(factura) {
    return axios.post(BASE_URL, factura);
  }

  getNextId() {
    return axios.get(BASE_URL + "/getNextId");
  }
  

  updateFactura(factura) {
    return axios.put(BASE_URL, factura);
  }
  allProductosServicios(){
    return axios.get(BASE_URL+"/allProductosServicios");
}
getall(){
  return axios.get(BASE_URL+"/getall");
}


}

export default new OrdenCompraService();
