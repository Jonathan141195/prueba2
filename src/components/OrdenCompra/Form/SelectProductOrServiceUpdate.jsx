import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import { ListItemText, Typography } from '@mui/material';

SelectProductOrServiceUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  field: PropTypes.object.isRequired,
  handleValueChange: PropTypes.func.isRequired
};

export function SelectProductOrServiceUpdate({ field, data, index, handleValueChange }) {
  console.log('data:', data); // Verifica si los datos se están pasando correctamente

  if (!Array.isArray(data)) {
    console.error('Data must be an array');
    return null;
  }

  return (
    <FormControl variant='standard' fullWidth sx={{ m: 1 }}>
      <InputLabel id='ProductoServicio'>Producto/Servicio</InputLabel>
      <Select
        {...field}
        labelId='ProductoServicio'
        label='Producto/Servicio'
        value={field.value || ''}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selectedItem = data.find(item => item.id === selectedId);

          field.onChange(e);

          if (selectedItem) {
            if (selectedItem.tipo === 'Producto') {
              handleValueChange(index, `detalle_factura.${index}.producto_id`, selectedItem.id);
              handleValueChange(index, `detalle_factura.${index}.servicio_id`, ''); // Limpiar servicio_id
            } else if (selectedItem.tipo === 'Servicio') {
              handleValueChange(index, `detalle_factura.${index}.servicio_id`, selectedItem.id);
              handleValueChange(index, `detalle_factura.${index}.producto_id`, ''); // Limpiar producto_id
            }

            handleValueChange(index, `detalle_factura.${index}.precio`, parseFloat(selectedItem.precio));
            const cantidad = parseFloat(field.value.cantidad) || 1;
            handleValueChange(index, `detalle_factura.${index}.subtotal`, parseFloat(selectedItem.precio) * cantidad);
          }
        }}
      >
        {data.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <ListItemText>
              <Typography variant="subtitle1">{item.nombre}</Typography>
              <Typography variant="body2">{item.descripcion}</Typography>
              <Typography variant="body1">₡{item.precio}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}


