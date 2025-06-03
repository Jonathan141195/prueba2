import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SeleccionarCategoria.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SeleccionarCategoria({ field, data }) {
  return (
    <>
      <>
        <InputLabel id='categoria'>Categoria</InputLabel>
        <Select
          {...field}
          labelId='categoria'
          label='categoria'
          defaultValue=''
          value={field.value}
        >
          {data &&
            data.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.descripcion} 
              </MenuItem> 
            ))}
        </Select>
      </>
    </>
  );
}

