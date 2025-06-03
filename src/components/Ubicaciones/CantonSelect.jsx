import { MenuItem, Select, InputLabel, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";

export const CantonSelect = ({ field, error, direcciones }) => {
  const [cantones, setCantones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (direcciones && direcciones.provincia && direcciones.provincia.id) {
      setLoading(true);
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${direcciones.provincia.id}/cantones.json`)
        .then((response) => response.json())
        .then((data) => {
          const listaCantones = Object.entries(data).map(([key, value]) => ({ id: key, nombre: value }));
          setCantones(listaCantones);
          setFetchError(null); // Clear any previous errors
        })
        .catch((error) => {
          console.error("Error fetching cantones:", error);
          setFetchError("Error al cargar los cantones");
        })
        .finally(() => setLoading(false));
    }
  }, [direcciones]);

  const handleChange = (e) => {
    const selectedCanton = cantones.find((canton) => canton.id === e.target.value);
    if (selectedCanton) {
      field.onChange({
        target: {
          name: field.name,
          value: selectedCanton.id,
        },
      });
      if (direcciones && direcciones.setCanton) {
        direcciones.setCanton(selectedCanton); // Update with object containing both id and nombre
      }
      if (direcciones && direcciones.setDistrito) {
        direcciones.setDistrito(''); // Clear distrito when canton changes
      }
    }
  };

  if (!direcciones || !direcciones.provincia) return null; // Handle case where direcciones or provincia is undefined

  if (loading) return <p>Cargando cantones...</p>;

  if (fetchError) return <p>Error: {fetchError}</p>;

  return (
    <>
      <InputLabel>Cantón</InputLabel>
      <Select
        {...field}
        value={field.value || ""}
        onChange={handleChange}
        error={Boolean(error)}
      >
        <MenuItem value="">
          <em>Seleccione un cantón</em>
        </MenuItem>
        {cantones.map((canton) => (
          <MenuItem key={canton.id} value={canton.id}>
            {canton.nombre}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText sx={{ color: '#d32f2f' }}>{error.message}</FormHelperText>}
    </>
  );
};




