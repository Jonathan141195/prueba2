import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const SeleccionarHorario = ({ field, data }) => {
  const handleChange = (event) => {
    const { value } = event.target;
    const selectedIndex = field.value.indexOf(value);
    const newSelected = [...field.value];

    if (selectedIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    field.onChange(newSelected);
  };

  return (
    <FormControl fullWidth>
      <Typography variant="subtitle1">Seleccionar Horarios:</Typography>
      <FormGroup>
        {data.map((horario) => (
          <FormControlLabel
            key={horario.id}
            control={
              <Checkbox
                checked={field.value.indexOf(horario.id) !== -1}
                onChange={handleChange}
                value={horario.id}
              />
            }
            label={`${horario.hora_inicio} - ${horario.hora_fin}`}
          />
        ))}
      </FormGroup>
      <FormHelperText error>{}</FormHelperText>
    </FormControl>
  );
};

SeleccionarHorario.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default SeleccionarHorario;








