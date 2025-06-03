import { useEffect, useState } from "react";
import { FormularioProducto } from "./FormularioProducto";
import ProductoService from "../../services/ProductoService";
import { useNavigation, useParams } from "react-router-dom";
import { isNil } from "lodash";
import { useSnackbar } from "../../stores/useSnackbar";

export function EditarProducto() {
  const routeParams = useParams();
  //Id de la proveedor a actualizar
  const id = routeParams.id || null;
  const navigate = useNavigation();

  const [producto, setProducto] = useState(null); // usestate una variable estado

  const setMessage = useSnackbar((state) => state.setMessage);

  // actualiza valores de la pagina cuando alguna de las dependencias se modifica
  // javascript funtion nombre (...) {} estructura  (...)=>{}
  useEffect(() => {
    if (id != undefined && !isNaN(Number(id))) {
      ProductoService.getProductoId(Number(id))
        .then((response) => {
          if (response.data.results == null) {
            setMessage("No existe el producto que desea editar", "error", { vertical: 'top', horizontal: 'right' })
            navigate("/mantenimientoProducto");
          }
          setProducto(response.data.results);
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            navigate("/mantenimientoProducto");
          }
        });
    }
  }, [id, navigate, setMessage]);

  if (isNil(producto)) {
    return "Cargando Producto"
  }

  return (
    <FormularioProducto titulo="Editar Producto" producto={producto} />
  );
}