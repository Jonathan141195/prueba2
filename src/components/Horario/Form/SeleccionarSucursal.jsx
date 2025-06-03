import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

const SeleccionarSucursal = ({ field, data, onChange }) => {
  const { name, value } = field;

  return (
    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
      <InputLabel id="sucursal">Sucursal</InputLabel>
      <Select
        id="sucursal"
        labelId="sucursal-label"
        label="Sucursal"
        name={name}
        value={value || ''}
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
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SeleccionarSucursal;

