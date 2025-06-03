import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

const SeleccionarServicio = ({ field, data, onChange }) => {
  return (
    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
      <InputLabel id="servicio">Servicio</InputLabel>
      <Select
        {...field}
        labelId="servicio"
        id="servicio"
        label="Servicio"
        value={field.value || ''}
        onChange={(event) => {
          field.onChange(event); // Asegúrate de que se actualiza el estado de react-hook-form
          if (onChange) onChange(event); // Llama a la función onChange pasada como prop si existe
        }}
      >
        <MenuItem value="">
          <em>Seleccionar Servicio</em>
        </MenuItem>
        {data.map((servicio) => (
          <MenuItem key={servicio.id} value={servicio.id}>
            {servicio.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SeleccionarServicio.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

export default SeleccionarServicio;
