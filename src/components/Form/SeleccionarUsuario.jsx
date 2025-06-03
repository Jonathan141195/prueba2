import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

const SeleccionarSucursal = ({ field, data, onChange }) => {
  return (
    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
      <InputLabel id="usuario">Usuario</InputLabel>
      <Select
        {...field}
        labelId="usuario"
        id="usuario"
        label="Usuario"
        value={field.value || ''}
        onChange={onChange}
      >
        <MenuItem value="">
          <em>Seleccionar Usuario</em>
        </MenuItem>
        {data.map((usuario) => (
          <MenuItem key={usuario.id} value={usuario.id}>
            {usuario.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SeleccionarSucursal.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SeleccionarSucursal; // Asegúrate de exportar por defecto el componente