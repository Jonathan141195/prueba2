
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
        onChange={onChange}
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
  onChange: PropTypes.func.isRequired,
};

export default SeleccionarServicio; // Asegúrate de exportar por defecto el componente