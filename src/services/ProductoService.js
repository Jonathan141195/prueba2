import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "producto";
class ProductoService {
  //Definición para Llamar al API y obtener el listado de películas
  //localhost:81/api/movie
  getProductos() {
    return axios.get(BASE_URL); // solo la difinicion
  }

  // obtener una producto
  // "http://localhost:81/api/#"
  getProductoId(ProductoId) {
    return axios.get(BASE_URL + "/" + ProductoId);
  }

  getProductoByOC(idProdcuto) {
    return axios.get(BASE_URL + "/" + idProdcuto);
  }

  getProductoByBodega(idBodega) {
    return axios.get(BASE_URL + "/getProductoByBodega/" + idBodega);
  }

  createProducto(Producto) {
    console.log(Producto);
    return axios.post(BASE_URL, Producto);
  }

  updateProducto(Producto) {
    return axios.put(BASE_URL, Producto);
  }

  
  getNextId() {
    return axios.get(BASE_URL + "/getNextId");
  }

  getProductosSinAsignarInventario(bodegaId, productoEditId) {
    let filter = ""
    if(productoEditId != 0){
      filter = "?productoEditId=" + productoEditId;
    }
    console.log(bodegaId, productoEditId, BASE_URL + "/getProductosSinAsignarInventario/" + bodegaId )
    return axios.get(BASE_URL + "/getProductosSinAsignarInventario/" + bodegaId + filter);
  }
  getTopProductos() {
    return axios.get(BASE_URL + "/getTopProductos");
  }
}

export default new ProductoService();
