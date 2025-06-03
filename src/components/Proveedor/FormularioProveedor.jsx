/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiFerre } from "./Validaciones/ProveedorYup";
import ProveedorService from "../../services/ProveedorService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ContactosProveedor } from "./ContactosProveedor";
import { DireccionesProveedor } from "./DireccionesProveedor";
import { InformacionBasicaProveedor } from "./InformacionBasicaProveedor";
import { useSnackbar } from "../../stores/useSnackbar";

export const FormularioProveedor = ({ titulo, proveedor }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  //Invocación del store para mensajes
  const setMessage = useSnackbar((state) => state.setMessage)

  const onError = (errors, e) => console.log(errors, e);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: proveedor.id,
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      direccion: proveedor.direccion,
      provincia: proveedor.provincia,
      canton: proveedor.canton,
      distrito: proveedor.distrito,
    },
    resolver: yupResolver(apiFerre),
  });


  const onSubmit = async (DataForm) => {
    try {
      if (apiFerre.isValid()) {
        const response = proveedor.id == 0
          ? await ProveedorService.createProveedor(DataForm)
          : await ProveedorService.updateProveedor(proveedor.id, DataForm);
        setError(response.error);
        if (response.data.results != null) {
          
          // Mostrar mensaje en pantalla
          setMessage(response.data.results, "success", { vertical: 'top', horizontal: 'right' })
          navigate("/mantenimientoProveedor");
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

            <InformacionBasicaProveedor control={control} errors={errors} />

            <DireccionesProveedor control={control} proveedorProvincia={proveedor.provincia}
              proveedorCanton={proveedor.canton} proveedorDistrito={proveedor.distrito} errors={errors} />

            <ContactosProveedor control={control} contactos={proveedor.contactos} errors={errors} />

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
