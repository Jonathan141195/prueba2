import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "contacto";
class ContactorService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getContactos() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getContactoId(ContactoId) {
    return axios.get(BASE_URL + "/" + ContactoId);
  }

  createContacto(Contacto) {
    return axios.post(BASE_URL, Contacto);
  }

  
}
export default new ContactorService();