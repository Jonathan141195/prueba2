import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const SeleccionarUsuario = ({ field, data, onChange }) => {
  const handleChange = (event) => {
    const { value: userId } = event.target;

    // Clonar el array de usuarios seleccionados actualmente
    const newSelected = [...(field.value || [])];

    const selectedIndex = newSelected.indexOf(userId);

    if (selectedIndex === -1) {
      newSelected.push(userId);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    onChange(newSelected); // Llama a la función onChange con el nuevo array de usuarios seleccionados
  };

  return (
    <FormControl fullWidth>
      <Typography variant="subtitle1">Seleccionar Usuarios:</Typography>
      <FormGroup>
        {data.map((usuario) => (
          <FormControlLabel
            key={usuario.id}
            control={
              <Checkbox
                checked={(field.value || []).includes(usuario.id.toString())} // Verifica si el usuario está en la lista de seleccionados
                onChange={handleChange} // Maneja el cambio de selección
                value={usuario.id.toString()} // Asigna el valor del checkbox
                name={usuario.id.toString()} // Asigna el nombre del checkbox (opcional)
              />
            }
            label={usuario.nombre}
          />
        ))}
      </FormGroup>
      <FormHelperText error>{field.error?.message}</FormHelperText>
    </FormControl>
  );
};

SeleccionarUsuario.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SeleccionarUsuario;




