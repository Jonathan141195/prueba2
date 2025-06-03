import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useEffect } from 'react';

export function DistritoSelectUpdate({ control, field, error, setDirecciones, idProvincia, idCanton, distritos }) {
  useEffect(() => {
    if (field.value) {
      const selectedDistrito = distritos[field.value];
      if (selectedDistrito) {
        setDirecciones((prev) => ({
          ...prev,
          distrito: { id: field.value, nombre: selectedDistrito },
        }));
      }
    }
  }, [field.value, distritos, setDirecciones]);

  return (
    <FormControl variant="standard" fullWidth error={error}>
      <InputLabel id="distrito-label">Distrito</InputLabel>
      <Controller
        name="distrito"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Select
            labelId="distrito-label"
            id="distrito"
            value={value}
            onChange={(e) => {
              onChange(e);
              const selectedDistrito = distritos[e.target.value];
              setDirecciones((prev) => ({
                ...prev,
                distrito: { id: e.target.value, nombre: selectedDistrito },
              }));
            }}
            label="Distrito"
          >
            {Object.keys(distritos).map((key) => (
              <MenuItem key={key} value={key}>
                {distritos[key]}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}

