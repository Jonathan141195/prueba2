/* eslint-disable react/prop-types */
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ProductoService from "../../services/ProductoService";
import { isEmpty, isNil, isPlainObject } from "lodash";

export const ProductoAutoComplete = ({ errors, field, datosBodegaProducto }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const valorEditProducto = datosBodegaProducto.bodegaEditId == datosBodegaProducto.bodegaSeleccionada ? datosBodegaProducto.productoEditId : 0;
        const response = await ProductoService.getProductosSinAsignarInventario(datosBodegaProducto.bodegaSeleccionada, valorEditProducto);
        setData(response.data.results);
        setLoaded(true);
      } catch (error) {
        setError(error.message);
        setLoaded(true);
      }
    };

    fetchData();
  }, [datosBodegaProducto.bodegaSeleccionada, datosBodegaProducto.bodegaEditId, datosBodegaProducto.productoEditId]);

  useEffect(() => {
    if (!isNil(data) && data.length > 0) {
      setProductos(
        data.map((element) => ({
          label: `${element.id}-${element.nombre}`,
          productoId: element.id,
        }))
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
    if (isNil(productoEdited)) {
      return "";
    }
    return productoEdited.label
  }

  field.value = datosBodegaProducto.productoSeleccionado;

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Autocomplete
      id="productoAutoComplete"
      options={productos}
      defaultValue={field.value}
      value={field.value == 0 ? null : field.value}
      onChange={(e, element) => {
        datosBodegaProducto.setProductoSeleccionado(element.productoId);
        field.onChange(element.productoId);
      }}
      getOptionLabel={(data) => getOptionLabel(data)}
      isOptionEqualToValue={(option, newValue) => {
        if (isPlainObject(newValue)) {
          return option.productoId == newValue.productoId;
        }
        return option.productoId == newValue;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Producto"
          error={Boolean(errors.productoId)}
          helperText={errors.productoId ? errors.productoId.message : ""}
        />
      )}
    />
  );
};
