import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SeleccionarConctacto.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SeleccionarConctacto({ field, data }) {
  return (
    <>
      <>
        <InputLabel id='id'>Contacto</InputLabel>
        <Select
          {...field}
          labelId='Id'
          label='Nombre'
          defaultValue=''
          value={field.value}
        >
          {data &&
            data.map((contacto) => (
              <MenuItem key={contacto.id} value={contacto.id}>
                {contacto.nombre} - {contacto.telefono} 
              </MenuItem> 
            ))}
        </Select>
      </>
    </>
  );
}
