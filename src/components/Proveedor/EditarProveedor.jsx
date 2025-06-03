import { useEffect, useState } from "react";
import { FormularioProveedor } from "./FormularioProveedor";
import ProveedorService from "../../services/ProveedorService";
import { useNavigation, useParams } from "react-router-dom";
import { isNil } from "lodash";
import { useSnackbar } from "../../stores/useSnackbar";

export function EditarProveedor() {
  const routeParams = useParams();
  //Id de la proveedor a actualizar
  const id = routeParams.id || null;
  const navigate = useNavigation();

  const [proveedor, setProveedor] = useState(null); // usestate una variable estado

  const setMessage = useSnackbar((state) => state.setMessage);

  // actualiza valores de la pagina cuando alguna de las dependencias se modifica
  // javascript funtion nombre (...) {} estructura  (...)=>{}
  useEffect(() => {
    if (id != undefined && !isNaN(Number(id))) {
      ProveedorService.getProveedorId(Number(id))
        .then((response) => {
          if (response.data.results == null) {
            setMessage("No existe el proveedor que desea editar", "error", { vertical: 'top', horizontal: 'right' })
            navigate("/mantenimientoProveedor");
          }
          setProveedor(response.data.results);
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            navigate("/mantenimientoProveedor");
          }
        });
    }
  }, [id, navigate, setMessage]);

  if (isNil(proveedor)) {
    return "Cargando Proveedor"
  }

  return (
    <FormularioProveedor titulo="Editar Proveedor" proveedor={proveedor} />
  );
}
