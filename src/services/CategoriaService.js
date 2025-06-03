import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "Categoria";
class CategoriaService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getCategoria() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getcategoriaId(categoriaId) {
    return axios.get(BASE_URL + "/" + categoriaId);
  }

}
export default new CategoriaService();