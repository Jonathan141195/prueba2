import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "salida_inventario";
class SalidaProductoService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getSalidaInventario() {
    return axios.get(BASE_URL); // solo la difinicion
  }
  getSalidaInventarioById(salidaInventarioId) {
    return axios.get(BASE_URL + "/" + salidaInventarioId);
  }
  createSalidaInventario(SalidaInventario) {
    return axios.post(BASE_URL, SalidaInventario);
  }

  updateSalidaInventario(SalidaInventarioId, SalidaInventario) {
    return axios.put(BASE_URL + "/" + SalidaInventarioId, SalidaInventario);
  }
}

export default new SalidaProductoService();
