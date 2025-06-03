/* eslint-disable no-unused-vars */
import { FormularioProveedor } from "./FormularioProveedor";

export function CrearProveedor() {
  const proveedor = {
    id: 0,
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    provincia: 0,
    canton: 0,
    distrito: 0,
    contactos: []
  }
  return (
    <FormularioProveedor titulo="Crear Proveedor" proveedor={proveedor} />
  );
}
