import  { useState, useEffect } from 'react';
import { TextField, IconButton, TableCell, TableRow, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

DetalleFacturaForm.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  control: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
};

export function DetalleFacturaForm({ field, data, index, onRemove, handleChange, control }) {
  const [selectedProducto, setSelectedProducto] = useState('');
  const [selectedServicio, setSelectedServicio] = useState('');

  // Use effect to set initial values
  useEffect(() => {
    if (field.producto_id) {
      setSelectedProducto(field.producto_id);
    }
    if (field.servicio_id) {
      setSelectedServicio(field.servicio_id);
    }
  }, [field]);

  return (
    <TableRow key={field.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Controller
          name={`detalle_factura.${index}.producto_id`}
          control={control}
          render={({ field: productoField }) => (
            <TextField
              {...productoField}
              select
              label="Producto"
              variant="outlined"
              value={selectedProducto}
              onChange={(e) => {
                const value = e.target.value;
                productoField.onChange(e);
                setSelectedProducto(value);
                setSelectedServicio(''); // Limpia el campo de servicio
                handleChange(index, `detalle_factura.${index}.producto_id`, value);
                handleChange(index, `detalle_factura.${index}.servicio_id`, ''); // Limpia el campo de servicio
              }}
              fullWidth
            >
              <MenuItem value="">Seleccionar Producto</MenuItem>
              {data.filter(item => item.tipo === 'Producto').map((producto) => (
                <MenuItem key={producto.id} value={producto.id}>
                  {producto.nombre}{"-"}  {producto.precio}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name={`detalle_factura.${index}.servicio_id`}
          control={control}
          render={({ field: servicioField }) => (
            <TextField
              {...servicioField}
              select
              label="Servicio"
              variant="outlined"
              value={selectedServicio}
              onChange={(e) => {
                const value = e.target.value;
                servicioField.onChange(e);
                setSelectedServicio(value);
                setSelectedProducto(''); // Limpia el campo de producto
                handleChange(index, `detalle_factura.${index}.servicio_id`, value);
                handleChange(index, `detalle_factura.${index}.producto_id`, ''); // Limpia el campo de producto
              }}
              fullWidth
            >
              <MenuItem value="">Seleccionar Servicio</MenuItem>
              {data.filter(item => item.tipo === 'Servicio').map((servicio) => (
                <MenuItem key={servicio.id} value={servicio.id}>
                  {servicio.nombre} {"-"}  {servicio.precio}
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
              type="number"
              variant="outlined"
              onChange={(e) => {
                field.onChange(e);
                handleChange(index, `detalle_factura.${index}.cantidad`, e.target.value);
              }}
              fullWidth
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
              type="number"
              variant="outlined"
              InputProps={{ readOnly: true }}
              fullWidth
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
              type="number"
              variant="outlined"
              InputProps={{ readOnly: true }}
              fullWidth
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


