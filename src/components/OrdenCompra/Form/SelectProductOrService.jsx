import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, Select, ListItemText, Typography } from '@mui/material';

SelectProductOrService.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  handleValueChange: PropTypes.func.isRequired,
};

export function SelectProductOrService({ field, data, index, handleValueChange }) {
  return (
    <FormControl variant='standard' fullWidth sx={{ m: 1 }}>
      <InputLabel id={`select-producto-servicio`}>Producto/Servicio</InputLabel>
      <Select
        {...field}
        labelId={`select-producto-servicio`}
        label='Producto/Servicio'
        defaultValue=''
        value={field.value}
        onChange={(e) => {
          const selectedItem = data.find(item => item.id === e.target.value);
          field.onChange(e);
          handleValueChange(index, `detalle_factura.${index}.producto_servicio_id`, e.target.value);
          handleValueChange(index, `detalle_factura.${index}.tipo`, selectedItem.tipo);
          handleValueChange(index, `detalle_factura.${index}.precio`, selectedItem.precio);
        }}
      >
        {data.map(item => (
          <MenuItem key={item.id} value={item.id}>
            <ListItemText>
              <Typography variant="subtitle1">{item.nombre} / {item.descripcion}</Typography>
              <Typography variant="body1">₡{item.precio}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

