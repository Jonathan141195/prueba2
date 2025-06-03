/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { isEmpty, isNil, isPlainObject } from "lodash";
import { Autocomplete, TextField } from "@mui/material";
import ProductoService from "../../services/ProductoService";

export const ProductosAutoComplete = ({
  errors,
  field,
  setBodegaSeleccionada,
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  useEffect(() => {
    ProductoService.getProductos()
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
        setProductos(
        data.map((element) => {
          return {
            label: `${element.id}-${element.nombre}`,
            productoId: element.id,
          };
        })
      );
    }
  }, [data]);

  const getOptionLabel = (data) => {
    if (data == "") {
      return "";
    }
    if (isEmpty(productos)) {
      return data;
    }
    if (isPlainObject(data)) {
      return data.label;
    }

    const productoEdited = productos.find((e) => e.productoId == data)
    return productoEdited.label
  }

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Autocomplete
      onChange={(e, element) => {
        setSelectedProducto(element);
        setBodegaSeleccionada(element.bodegaId);
        field.onChange(element.productoId);
      }}
      id="productosAutoComplete"
      options={productos}
      defaultValue={field.value}
      value={selectedProducto}
      getOptionLabel={(option) => getOptionLabel(option)}
      isOptionEqualToValue={(option, newValue) => {
        if (isPlainObject(newValue)) {
          return option.productoId == newValue.productoId;
        }
        return option.productoId == newValue;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Seleccione un producto"
          error={Boolean(errors.productoId)}
          helperText={errors.productoId ? errors.productoId.message : ""}
        />
      )}
    />

  );
};