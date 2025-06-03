import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton, TableCell, TableRow, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller} from 'react-hook-form';

DetalleFacturaForm.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  control: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  servicioSeleccionado: PropTypes.string.isRequired,
  
};

export function DetalleFacturaForm({ field, data, index, onRemove, handleChange, control, servicioSeleccionado }) {
  const [selectedServicio, setSelectedServicio] = useState('');

  useEffect(() => {
    if (servicioSeleccionado) {
      setSelectedServicio(servicioSeleccionado);
      handleChange(index, `detalle_factura.${index}.servicio_id`, servicioSeleccionado);
    }
  }, [servicioSeleccionado, index, handleChange]);

  return (
    <TableRow key={field.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Controller
          name={`detalle_factura.${index}.servicio_id`}
          control={control}
          render={({ field }) => (
            <TextField
              select
              {...field}
              value={selectedServicio}
              onChange={(e) => {
                field.onChange(e);
                setSelectedServicio(e.target.value);
                handleChange(index, `detalle_factura.${index}.servicio_id`, e.target.value);
              }}
              variant='outlined'
              fullWidth
              InputProps={{ readOnly: true }}
            >
              {data.map((servicio) => (
                <MenuItem key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`detalle_factura.${index}.cantidad`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type='number'
              onChange={(e) => {
                field.onChange(e);
                handleChange(index, 'cantidad', e.target.value);
              }}
              variant='outlined'
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`detalle_factura.${index}.precio`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type='number'
              variant='outlined'
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`detalle_factura.${index}.subtotal`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type='number'
              variant='outlined'
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onRemove(index)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}




