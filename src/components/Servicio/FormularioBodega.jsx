/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, FormControl, Grid, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiFerre } from "./Validaciones/BodegaYup";
import ServicioService from "../../services/ServicioService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "../../stores/useSnackbar";
import { InformacionBasicaBodega } from "./InformacionBasicaBodega";
import { DireccionesBodegas } from "./DireccionesBodegas";

export const FormularioBodega = ({ titulo, bodega }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  //Invocación del store para mensajes
  const setMessage = useSnackbar((state) => state.setMessage);

  const onError = (errors, e) => console.log(errors, e);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: bodega.id,
      nombre: bodega.nombre,
      dimensiones: bodega.dimensiones,
      capacidad: bodega.capacidad,
      vencimiento: bodega.vencimiento,
      telefono: bodega.telefono,
      provinciaId: bodega.provinciaId,
      cantonId: bodega.cantonId,
      distritoId: bodega.distritoId,
      direccion: bodega.direccion,
    },
    resolver: yupResolver(apiFerre),
  });

  const onSubmit = async (DataForm) => {
    try {
      if (apiFerre.isValid()) {
        const response =
          bodega.id == 0
            ? await BodegaService.createBodega(DataForm)
            : await BodegaService.updateBodega(bodega.id, DataForm);
        setError(response.error);
        if (response.data.results != null) {
          // Mostrar mensaje en pantalla
          setMessage(response.data.results, "success", {
            vertical: "top",
            horizontal: "right",
          });
          navigate("/mantenimientoBodega");
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      }
    }
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          {titulo}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Grid container spacing={2}>
            <InformacionBasicaBodega
              control={control}
              errors={errors}
              isEdditing={bodega.id != 0}
            />
              

            <Grid item xs={6} sm={6} md={7}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="provinciaId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="provinciaId"
                      label="Provincia"
                      error={Boolean(errors.provinciaId)}
                      helperText={
                        errors.provinciaId ? errors.provinciaId.message : ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={12} md={7}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="cantonId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="cantonId"
                      label="Cantón"
                      error={Boolean(errors.cantonId)}
                      helperText={
                        errors.cantonId ? errors.cantonId.message : ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            
            <Grid item xs={12} sm={12} md={7}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="distritoId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="distritoId"
                      label="Distrito"
                      error={Boolean(errors.distritoId)}
                      helperText={
                        errors.distritoId ? errors.distritoId.message : ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={7}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="direccion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="direccion"
                      label="Dirección"
                      error={Boolean(errors.direccion)}
                      helperText={
                        errors.direccion ? errors.direccion.message : ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>



            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ mt: 1, mb: 1, fontWeight: "bold", fontSize: "1rem" }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};
