/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ProductoService from "../../../services/ProductoService";
import { Controller, useFieldArray } from "react-hook-form";
import { LineaDetalleOrdenCompra } from "./LineaDetalleOrdenCompra";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
export const DetalleOrdenCompra = ({
  control,
  bodegaSeleccionada,
  watch,
  setValue,
}) => {
  const [dataProducto, setProducto] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    if (bodegaSeleccionada) {
      ProductoService.getProductoByBodega(bodegaSeleccionada)
        .then((response) => {
          setProducto(response.data.results);
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    }
  }, [bodegaSeleccionada]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "oc_producto",
  });

  const addNewOrdenCompra = () => {
    append({
      productoId: "",
      cantidad: 1,
      subtotal: 0,
      precio: 0,
    });
  };

  const removeOrdenCompra = (index) => {
    if (fields.length === 1) {
      return;
    }
    remove(index);
  };

  const watchOrdenes = watch("oc_producto");
  //OnChange para realizar los calculos
  const handleInputChange = (index, name, value) => {
    let total = 0;
    let subtotal = 0;
    if (dataProducto && name == `oc_producto.${index}.productoId` && value) {
      let producto = dataProducto.find((item) => item.id == value);
      setValue(`oc_producto.${index}.precio`, producto.costo);
    }
    //name no es necesario index es el indice que se acaba de activar  el valor q cambio
    //Obtener y establecer precio de la pelicula

    //Calcular subtotal castear los datos en js

    if (watchOrdenes[index]) {
      subtotal =
        parseFloat(watchOrdenes[index].cantidad) *
        parseFloat(watchOrdenes[index].precio);
      setValue(`oc_producto.${index}.subtotal`, subtotal);
    }

    //Calcular total

    watchOrdenes.map((item) => {
      total += item.subtotal;
    });
    setValue(`total`, total);
  };

  if (error) return <p>Error: {error.message}</p>;
  return (
    <Grid item xs={12} sm={12}>
      <Typography variant="h6" gutterBottom>
        Productos
        <Tooltip title="Agregar Producto">
          <span>
            <IconButton color="secondary" onClick={addNewOrdenCompra}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Typography>
      <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Productos">
            <TableHead>
              <TableRow sx={{ backgroundColor: "orange" }}>
                <TableCell style={{ fontWeight: "bold", color: "black" }}>
                  #
                </TableCell>
                <TableCell
                  style={{
                    width: 400,
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Producto
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "black" }}>
                  Cantidad
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "black" }}>
                  Precio
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "black" }}>
                  Subtotal
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "black" }}>
                  Eliminar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <LineaDetalleOrdenCompra
                  name="oc_producto"
                  field={field}
                  data={dataProducto}
                  key={field.id}
                  index={index}
                  onRemove={removeOrdenCompra}
                  handleChange={handleInputChange}
                  control={control}
                  disableRemoveButton={fields.length === 1}
                />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow sx={{ borderTop: "solid", borderColor: "orange" }}>
                <TableCell
                  colSpan={4}
                  align="right"
                  sx={{ color: "orange", fontWeight: 800 }}
                >
                  <Typography variant="h6" component="h6">
                    Total{" "}
                  </Typography>
                </TableCell>
                <TableCell colSpan={2} sx="font-weigh:800">
                  <Controller
                    name="total"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="total"
                        label="Total"
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              &cent;
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </FormControl>
    </Grid>
  );
};
