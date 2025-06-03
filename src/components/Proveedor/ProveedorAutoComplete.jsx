/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { isEmpty, isNil, isPlainObject } from "lodash";
import { Autocomplete, TextField } from "@mui/material";
import ProveedorService from "../../services/ProveedorService";

export const ProveedorAutoComplete = ({
  errors,
  field,
  setProveedorSeleccionado,
  disabled = false,
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  useEffect(() => {
    ProveedorService.getProveedores()
      .then((response) => {
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  useEffect(() => {
    if (!isNil(data)) {
      setProveedores(
        data.map((element) => {
          return {
            label: `${element.id}-${element.nombre}`,
            proveedorId: element.id,
          };
        })
      );
    }
  }, [data]);

  const getOptionLabel = (option) => {
    if (!option) return "";
    if (isEmpty(proveedores)) return option;
    if (isPlainObject(option)) return option.label;
    
    const proveedorEdited = proveedores.find((e) => e.proveedorId == option);
    return proveedorEdited.label;
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Autocomplete
      onChange={(e, element) => {
        setSelectedProveedor(element);
        setProveedorSeleccionado(element.proveedorId);
        field.onChange(element.proveedorId);
      }}
      id="proveedorAutoComplete"
      options={proveedores}
      value={isEmpty(field.value) ? null : field.value}
      disabled={disabled}
      getOptionLabel={(option) => getOptionLabel(option)}
      isOptionEqualToValue={(option, newValue) => {
        if (isPlainObject(newValue)) {
          return option.proveedorId === newValue.proveedorId;
        }
        return option.proveedorId === newValue;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Proveedor"
          error={Boolean(errors.proveedorId)}
          helperText={errors.proveedorId ? errors.proveedorId.message : ""}
        />
      )}
    />
  );
};
