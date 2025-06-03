/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiFerre } from "./Validaciones/InventarioYup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "../../stores/useSnackbar";

import { InformacionBasicaInventario } from "./InformacionBasicaInventario";

export const FormularioInventario = ({ titulo, inventario }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  //Invocación del store para mensajes
  const setMessage = useSnackbar((state) => state.setMessage)

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      bodegaId: inventario.bodegaId,
      productoId: inventario.productoId,
      totalDisponible: inventario.totalDisponible,
      cantidadMinima: inventario.cantidadMinima,
      cantidadMaxima: inventario.cantidadMaxima,
      usuarioRegistra: inventario.usuarioRegistra,
      usuarioActualiza: inventario.usuarioActualiza,

    },
    resolver: yupResolver(apiFerre),
  });


  const onSubmit = async (DataForm) => {
    try {
      if (apiFerre.isValid()) {
        const response = inventario.id == 0
          ? await InventarioService.createInventario(DataForm)
          : await InventarioService.updateInventario(inventario.id, DataForm);
        setError(response.error);
        if (response.data.results != null) {

          // Mostrar mensaje en pantalla
          setMessage(response.data.results, "success", { vertical: 'top', horizontal: 'right' })
          navigate("/mantenimientoInventario");
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>

            <InformacionBasicaInventario
              control={control}
              errors={errors}
              isEdditing={inventario.id != 0}
              bodegaEditId={inventario.id != 0 ? inventario.bodegaId : 0}
              productoEditId={inventario.id != 0 ? inventario.productoId : 0}
            />


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