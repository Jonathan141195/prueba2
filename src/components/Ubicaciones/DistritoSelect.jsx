import { MenuItem, Select, InputLabel, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";

export const DistritoSelect = ({ direcciones, setDirecciones, field, error }) => {
  const [distritos, setDistritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setDistritos([]);
    setLoading(true);
    if (direcciones && direcciones.provincia && direcciones.provincia.id &&
        direcciones.canton && direcciones.canton.id) {
      fetch(
        `https://ubicaciones.paginasweb.cr/provincia/${direcciones.provincia.id}/canton/${direcciones.canton.id}/distritos.json`
      )
        .then((response) => response.json())
        .then((data) => {
          const listaDistritos = Object.entries(data).map(([key, value]) => ({ id: key, nombre: value }));
          setDistritos(listaDistritos);
          setFetchError(null); // Clear any previous errors
        })
        .catch((error) => {
          console.error("Error fetching distritos:", error);
          setFetchError("Error al cargar los distritos");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [direcciones]);

  useEffect(() => {
    // Set the selected distrito when direcciones.distrito.id changes
    if (direcciones && direcciones.distrito && direcciones.distrito.id) {
      const selectedDistrito = distritos.find(distrito => distrito.id === direcciones.distrito.id);
      if (selectedDistrito) {
        field.onChange(selectedDistrito.id); // Update form with distrito ID
      }
    }
  }, [direcciones?.distrito?.id, distritos, field]);

  if (!direcciones || !direcciones.provincia || !direcciones.canton) return null; // Handle case where direccion is not fully defined

  if (loading) return <p>Cargando distritos...</p>;

  if (fetchError) return <p>Error: {fetchError}</p>;

  return (
    <>
      <InputLabel>Distrito</InputLabel>
      <Select
        {...field}
        value={field.value || ""}
        onChange={(e) => {
          const selectedDistrito = distritos.find(distrito => distrito.id === e.target.value);
          if (selectedDistrito) {
            field.onChange(selectedDistrito.id); // Update form with distrito ID
            setDirecciones({
              ...direcciones,
              distrito: selectedDistrito
            });
          }
        }}
        error={Boolean(error)}
      >
        <MenuItem value="">
          <em>Seleccione un distrito</em>
        </MenuItem>
        {distritos.map((distrito) => (
          <MenuItem key={distrito.id} value={distrito.id}>
            {distrito.nombre}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText sx={{ color: '#d32f2f' }}>{error.message}</FormHelperText>}
    </>
  );
};