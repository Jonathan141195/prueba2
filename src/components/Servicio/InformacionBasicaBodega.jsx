/* eslint-disable react/prop-types */
import { FormControl, Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const InformacionBasicaBodega = ({ control, errors, isEdditing }) => {
  return (
    <>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="nombre"
                label="Nombre"
                disabled={isEdditing}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre ? errors.nombre.message : ""}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="dimensiones"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="dimensiones"
                label="Dimensiones"
                error={Boolean(errors.dimensiones)}
                helperText={
                  errors.dimensiones ? errors.dimensiones.message : ""
                }
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="capacidad"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="capacidad"
                label="Capacidad"
                error={Boolean(errors.capacidad)}
                helperText={errors.capacidad ? errors.capacidad.message : ""}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="vencimiento"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="vencimiento"
                label="Vencimiento"
                type="date"
                error={Boolean(errors.vencimiento)}
                helperText={
                  errors.vencimiento ? errors.vencimiento.message : ""
                }
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="telefono"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="telefono"
                label="Teléfono"
                error={Boolean(errors.telefono)}
                helperText={errors.telefono ? errors.telefono.message : ""}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="standard" fullWidth>
          <Controller
            name="correo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="correo"
                label="Correo"
                error={Boolean(errors.correo)}
                helperText={errors.correo ? errors.correo.message : ""}
              />
            )}
          />
        </FormControl>
      </Grid>
    </>
  );
};
