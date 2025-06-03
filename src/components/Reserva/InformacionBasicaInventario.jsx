/* eslint-disable react/prop-types */
import { FormControl, Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import { useState } from "react";

export const InformacionBasicaInventario = ({
  control,
  errors,
  isEdditing,
  bodegaEditId,
  productoEditId
}) => {
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState(bodegaEditId);
  const [productoSeleccionado, setProductoSeleccionado] = useState(productoEditId);

  const datosBodegaProducto = {
    bodegaSeleccionada: bodegaSeleccionada,
    bodegaEditId: bodegaEditId,
    productoSeleccionado: productoSeleccionado,
    productoEditId: productoEditId,
    setProductoSeleccionado: setProductoSeleccionado
  }

  const adjustSetBodegaSeleccionada = (value) => {
    setBodegaSeleccionada(value)
    setProductoSeleccionado(0)
  }

  return (
    <>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="bodegaId"
            control={control}
            render={({ field }) => {
              return (
                <BodegaAutoComplete
                  errors={errors}
                  field={field}
                  setBodegaSeleccionada={adjustSetBodegaSeleccionada}
                />
              )
            }}
          />
        </FormControl>

      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="productoId"
            control={control}
            render={({ field }) => {
              //console.log(isEmpty(value), !isInArray(value), value, productos, productos.find((e) => e.productoId == isPlainObject(value) ? value.productoId : value))
              return (
                <ProductoAutoComplete
                  errors={errors}
                  field={field}
                  datosBodegaProducto={datosBodegaProducto}
                />
              )
            }}
          />
        </FormControl>

      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="totalDisponible"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="totalDisponible"
                label="Total Disponible"
                inputProps={{ type: 'number' }}
                disabled={isEdditing} // Campo desactivado al editar
                error={Boolean(errors.totalDisponible)}
                helperText={
                  errors.totalDisponible ? errors.totalDisponible.message : ""
                }
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="cantidadMinima"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="cantidadMinima"
                label="Cantidad Mínima"
                inputProps={{ type: 'number' }}
                error={Boolean(errors.cantidadMinima)}
                helperText={
                  errors.cantidadMinima ? errors.cantidadMinima.message : ""
                }
              />
            )}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="cantidadMaxima"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="cantidadMaxima"
                label="Cantidad Máxima"
                inputProps={{ type: 'number' }}
                error={Boolean(errors.cantidadMaxima)}
                helperText={
                  errors.cantidadMaxima ? errors.cantidadMaxima.message : ""
                }
              />
            )}
          />
        </FormControl>
      </Grid>
    </>
  );
};
