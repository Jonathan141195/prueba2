import { MenuItem, Select, FormHelperText, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";

export const ProvinciaSelect = ({ field, error, direcciones }) => {
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://ubicaciones.paginasweb.cr/provincias.json")
      .then((response) => response.json())
      .then((data) => {
        const provincias = Object.entries(data).map(([key, value]) => ({ id: key, nombre: value }));
        setProvincias(provincias);
        setFetchError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error("Error fetching provincias:", error);
        setFetchError("Error al cargar las provincias");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando provincias...</p>;

  if (fetchError) return <p>Error: {fetchError}</p>;

  return (
    <>
      <InputLabel>Provincia</InputLabel>
      <Select
        {...field}
        value={field.value || ""}
        onChange={(e) => {
          const selectedProvincia = provincias.find(provincia => provincia.id === e.target.value);
          if (selectedProvincia) {
            field.onChange({
              target: {
                name: field.name,
                value: selectedProvincia.id // Change to send ID instead of name
              }
            });
            direcciones.setProvincia(selectedProvincia); // Update with object containing both id and name
          }
        }}
        error={Boolean(error)}
      >
        <MenuItem value="">
          <em>Seleccione una provincia</em>
        </MenuItem>
        {provincias.map((provincia) => (
          <MenuItem key={provincia.id} value={provincia.id}>
            {provincia.nombre}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText sx={{ color: '#d32f2f' }}>{error.message}</FormHelperText>}
    </>
  );
};


