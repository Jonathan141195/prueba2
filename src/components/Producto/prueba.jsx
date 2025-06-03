import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import ProveedorService from "../../services/ProveedorService";

export function CrearProveedor() {
  const navigate = useNavigate();
  const apiFerre = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido.")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    telefono: yup
      .number()
      .typeError("Solo acepta números")
      .required("El teléfono es requerido")
      .positive("Solo acepta números positivos"),
    correo: yup
      .string()
      .required("El correo es requerido.")
      .min(2, "El correo debe tener al menos 2 caracteres"),
    direccion: yup
      .string()
      .required("La dirección es requerida.")
      .min(2, "La dirección debe tener al menos 2 caracteres"),
    provincia: yup
      .string()
      .required("La provincia es requerida.")
      .min(2, "La provincia debe tener al menos 2 caracteres"),
    canton: yup
      .string()
      .required("El cantón es requerido.")
      .min(2, "El cantón debe tener al menos 2 caracteres"),
    distrito: yup
      .string()
      .required("El distrito es requerido.")
      .min(2, "El distrito debe tener al menos 2 caracteres"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      telefono: "",
      correo: "",
      direccion: "",
      provincia: "",
      canton: "",
      distrito: "",
    },
    resolver: yupResolver(apiFerre),
  });

  const onSubmit = (formData) => {
    ProveedorService.createProveedor(formData)
      .then((response) => {
        console.log(response);
        if (response.data.results != null) {
          toast.success(response.data.results, {
            duration: 4000,
            position: "top-center",
          });
          navigate("/proveedor-table");
        } else {
          toast.error("Error al guardar el proveedor");
        }
      })
      .catch((error) => {
        console.error("Error al enviar el formulario:", error);
        toast.error("Error al enviar el formulario");
      });
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Crear Proveedor
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
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
                  name="telefono"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="telefono"
                      label="Teléfono"
                      error={Boolean(errors.telefono)}
                      helperText={
                        errors.telefono ? errors.telefono.message : ""
                      }
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
                      helperText={errors.correo ? errors.correo.message : " "}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <Controller
                  name="direccion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="direccion"
                      label="Direccion"
                      error={Boolean(errors.direccion)}
                      helperText={
                        errors.direccion ? errors.direccion.message : " "
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <Controller
                  name="provincia"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="provincia"
                      label="Provincia"
                      error={Boolean(errors.provincia)}
                      helperText={
                        errors.provincia ? errors.provincia.message : " "
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <Controller
                  name="canton"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="canton"
                      label="Canton"
                      error={Boolean(errors.canton)}
                      helperText={errors.canton ? errors.canton.message : " "}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <Controller
                  name="distrito"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="distrito"
                      label="Distrito"
                      error={Boolean(errors.distrito)}
                      helperText={
                        errors.distrito ? errors.distrito.message : " "
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            {/* Agregar más campos de formulario aquí */}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ m: 1, fontWeight: "bold", fontSize: "1rem" }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
