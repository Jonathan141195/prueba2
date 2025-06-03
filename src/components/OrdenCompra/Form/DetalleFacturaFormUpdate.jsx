import PropTypes from 'prop-types';
import { TableCell, TableRow, TextField, IconButton, Tooltip, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller } from 'react-hook-form';
import { SelectProductOrServiceUpdate } from './SelectProductOrServiceUpdate'; // Asegúrate de que esta importación sea correcta

DetalleFacturaFormUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  disableRemoveButton: PropTypes.bool.isRequired,
  field: PropTypes.object.isRequired,
};

export function DetalleFacturaFormUpdate({
  data,
  control,
  index,
  onRemove,
  handleChange,
  disableRemoveButton,
  field,
}) {
  return (
    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component='th' scope='row'>
        {index + 1}
      </TableCell>
      <TableCell>
        <Controller
          name={`detalle_factura.${index}.producto_id`}
          control={control}
          render={({ field }) => (
            <SelectProductOrServiceUpdate
              field={field}
              data={data}
              index={index}
              handleValueChange={handleChange}
            />
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
              label='Cantidad'
              type='number'
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
              onChange={(e) => {
                field.onChange(e);
                handleChange(index, `detalle_factura.${index}.cantidad`, e.target.value);
              }}
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
              label='Precio'
              InputProps={{
                readOnly: true,
                startAdornment: <InputAdornment position="start">₡</InputAdornment>,
              }}
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
              label='Subtotal'
              InputProps={{
                readOnly: true,
                startAdornment: <InputAdornment position="start">₡</InputAdornment>,
              }}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Tooltip title={`Eliminar detalle ${index + 1}`}>
          <span>
            <IconButton
              edge='end'
              disabled={disableRemoveButton}
              onClick={() => onRemove(index)}
              aria-label='Eliminar'
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
