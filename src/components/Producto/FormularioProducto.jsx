/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Button,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import { SeleccionarCategoria } from "../Form/SeleccionarCategoria";
import { yupProducto } from "./Validaciones/ProductoYup";

import { useSnackbar } from "../../stores/useSnackbar";

export function FormularioProducto({ titulo, producto }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(producto.id); // Variable para almacenar el próximo id
  const [categoriaSelected, setCategoriaSelected] = useState(""); //Nombre de la categoria
  const [selectCategoria, setSelectCategoria] = useState(
    producto.id != 0 ? producto : null
  );
  const setMessage = useSnackbar((state) => state.setMessage);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      marca: producto.marca,
      modelo: producto.modelo,
      Categoria_id: producto.Categoria_id,
      
      // Incluye tus otros valores por defecto aquí
    },
    resolver: yupResolver(yupProducto),
    shouldUnregister: false,
  });

  const onSubmit = async (DataForm) => {
    try {
      if (yupProducto.isValid()) {
        const response =
          producto.id == 0
            ? await ProductoService.createProducto(DataForm)
            : await ProductoService.updateProducto(producto.id, DataForm);
        setError(response.error);
        if (response.data.results != null) {
          // Mostrar mensaje en pantalla
          setMessage(response.data.results, "success", {
            vertical: "top",
            horizontal: "right",
          });
          navigate("/mantenimientoProducto");
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      }
    }
  };

  useEffect(() => {
    if (producto.id == 0) {
      ProductoService.getNextId()
        .then((response) => {
          setNextId(response.data.results.Codigo);
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    }
  }, [producto.id]); //callback - funcion separada del llamado

  

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container spacing={2} sx={{ marginTop: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          {titulo}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={1}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="id"
                      label="Id"
                      error={Boolean(errors.id)}
                      helperText={errors.id ? errors.id.message : ""}
                      value={nextId} // Usa el próximo id como valor
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
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
            <Grid item xs={12} sm={12} md={7}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="descripcion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="descripcion"
                      label="Descripción"
                      error={Boolean(errors.descripcion)}
                      helperText={
                        errors.descripcion ? errors.descripcion.message : ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
              <FormControl variant="standard" fullWidth>
                {/* Lista de subcategorias */}
                <Controller
                  name="Categoria_id"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SeleccionarCategoria
                      onChange={onChange}
                      value={value}
                      setCategoriaSeleccionada={setSelectCategoria}
                      errors={errors}
                      helperText={
                        errors.Categoria ? errors.Categoria.message : ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={12} md={4}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="marca"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="marca"
                      label="marca"
                      error={Boolean(errors.marca)}
                      helperText={errors.marca ? errors.marca.message : ""}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="modelo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="modelo"
                      label="modelo"
                      error={Boolean(errors.modelo)}
                      helperText={errors.modelo ? errors.modelo.message : ""}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={3}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="precio"
                      label="precio"
                      error={Boolean(errors.precio)}
                      helperText={errors.precio ? errors.precio.message : " "}
                    />
                  )}
                />
              </FormControl>
            </Grid>
           
            
           

            <Grid item xs={12} sm={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
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
