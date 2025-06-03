import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

const SeleccionarSucursal = ({ field, data, onChange }) => {
  return (
    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
      <InputLabel id="sucursal">Sucursal</InputLabel>
      <Select
        {...field}
        labelId="sucursal"
        id="sucursal"
        label="Sucursal"
        value={field.value || ''}
        onChange={onChange}
      >
        <MenuItem value="">
          <em>Seleccionar Sucursal</em>
        </MenuItem>
        {data.map((sucursal) => (
          <MenuItem key={sucursal.id} value={sucursal.id}>
            {sucursal.nombre}
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
