/* eslint-disable react/prop-types */
import {
    FormControl,
    Grid,
    TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
export const InformacionBasicaProveedor = ({ control, errors }) => {
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
        </>
    )
}