import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useEffect } from 'react';

export function CantonSelectUpdate({ control, field, error, setDirecciones, idProvincia, cantones, setDistritos }) {
  useEffect(() => {
    if (field.value) {
      const selectedCanton = cantones[field.value];
      if (selectedCanton) {
        setDirecciones((prev) => ({
          ...prev,
          canton: { id: field.value, nombre: selectedCanton },
          distrito: { id: '', nombre: '' },
        }));
      }
    }
  }, [field.value, cantones, setDirecciones]);

  return (
    <FormControl variant="standard" fullWidth error={error}>
      <InputLabel id="canton-label">Cantón</InputLabel>
      <Controller
        name="canton"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Select
            labelId="canton-label"
            id="canton"
            value={value}
            onChange={(e) => {
              onChange(e);
              const selectedCanton = cantones[e.target.value];
              setDirecciones((prev) => ({
                ...prev,
                canton: { id: e.target.value, nombre: selectedCanton },
                distrito: { id: '', nombre: '' },
              }));
              // Fetch districts when a new canton is selected
              fetch(`https://ubicaciones.paginasweb.cr/provincia/${idProvincia}/canton/${e.target.value}/distritos.json`)
                .then((response) => response.json())
                .then((data) => {
                  setDistritos(data);
                })
                .catch((error) => console.error('Error fetching distritos:', error));
            }}
            label="Cantón"
          >
            {Object.keys(cantones).map((key) => (
              <MenuItem key={key} value={key}>
                {cantones[key]}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}

