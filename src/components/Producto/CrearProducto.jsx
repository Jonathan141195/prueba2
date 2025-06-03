/* eslint-disable no-unused-vars */
import { FormularioProducto } from "./FormularioProducto";

export function CrearProducto() {
  const producto = {
    id: 0,
    nombre: "",
    descripcion: "",
    precio: 0,
    marca: "", // por default
    modelo: "",
    Categoria_id: 0,
 
  }
  return (
    <FormularioProducto titulo="Crear Producto" producto={producto} />
  );
}


