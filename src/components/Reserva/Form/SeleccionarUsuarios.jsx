import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

const SeleccionarUsuario = ({ field, data, onChange }) => {
  return (
    <FormControl variant="standard" fullWidth sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="usuario">Usuario</InputLabel>
      <Select
        {...field}
        labelId="usuario"
        id="usuario"
        label="Usuario"
        value={field.value || ''}
        onChange={(event) => {
          field.onChange(event); // Asegúrate de que se actualiza el estado de react-hook-form
          if (onChange) onChange(event); // Llama a la función onChange pasada como prop si existe
        }}
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

SeleccionarUsuario.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

export default SeleccionarUsuario;





