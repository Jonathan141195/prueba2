import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useEffect } from 'react';

export function ProvinciaSelectUpdate({ control, field, error, setDirecciones, provincias, setCantones }) {
  useEffect(() => {
    if (field.value) {
      const selectedProvincia = provincias[field.value];
      if (selectedProvincia) {
        setDirecciones((prev) => ({
          ...prev,
          provincia: { id: field.value, nombre: selectedProvincia },
          canton: { id: '', nombre: '' },
          distrito: { id: '', nombre: '' },
        }));
      }
    }
  }, [field.value, provincias, setDirecciones]);

  return (
    <FormControl variant="standard" fullWidth error={error}>
      <InputLabel id="provincia-label">Provincia</InputLabel>
      <Controller
        name="provincia"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Select
            labelId="provincia-label"
            id="provincia"
            value={value}
            onChange={(e) => {
              onChange(e);
              const selectedProvincia = provincias[e.target.value];
              setDirecciones((prev) => ({
                ...prev,
                provincia: { id: e.target.value, nombre: selectedProvincia },
                canton: { id: '', nombre: '' },
                distrito: { id: '', nombre: '' },
              }));
              // Fetch cantons when a new province is selected
              fetch(`https://ubicaciones.paginasweb.cr/provincia/${e.target.value}/cantones.json`)
                .then((response) => response.json())
                .then((data) => {
                  setCantones(data);
                })
                .catch((error) => console.error('Error fetching cantones:', error));
            }}
            label="Provincia"
          >
            {Object.keys(provincias).map((key) => (
              <MenuItem key={key} value={key}>
                {provincias[key]}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}


