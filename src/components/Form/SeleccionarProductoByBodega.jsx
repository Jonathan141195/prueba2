import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ProductoService from "../../services/ProductoService";
import PropTypes from "prop-types";

SeleccionarProductoByBodega.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  setBodegaSeleccionada: PropTypes.func.isRequired,
};

export function SeleccionarProductoByBodega({
  value,
  onChange,
  setBodegaSeleccionada,
}) {
  const [productos, setProductos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductosByBodega = async () => {
      try {
        if (!value) {
          setProductos([]); // Reinicia la lista de productos si no hay bodega seleccionada
          setLoaded(true);
          return;
        }

        const response = await ProductoService.getProductosByBodega(value);
        setProductos(response.data.results);
        setLoaded(true);
      } catch (error) {
        setError("Error al cargar los productos");
        setLoaded(false); // Reintentar carga en caso de error
      }
    };

    fetchProductosByBodega();
  }, [value]);

  const handleProductChange = (_, element) => {
    setBodegaSeleccionada(element);
    onChange(element ? element.id : null);
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!loaded && value && <p>Cargando...</p>}
      {loaded && productos.length > 0 && (
        <Autocomplete
          onChange={handleProductChange}
          id="productoAutoComplete"
          options={productos}
          getOptionLabel={(producto) => `${producto.id}-${producto.nombre}`}
          renderInput={(params) => <TextField {...params} label="Producto" />}
        />
      )}
    </div>
  );
}
