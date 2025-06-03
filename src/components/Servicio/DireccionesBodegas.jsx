/* eslint-disable react/prop-types */
import {
    FormControl,
    Grid,
    TextField,
    InputLabel,
    FormHelperText
} from "@mui/material";
import { Controller, } from "react-hook-form";
import { useState } from "react";
import { ProvinciaSelect } from "../Ubicaciones/ProvinciaSelect";
import { CantonSelect } from "../Ubicaciones/CantonSelect";


export const DireccionesBodegas = ({ control, proveedorProvincia, proveedorCanton, proveedorDistrito, errors }) => {
    const [provincia, setProvincia] = useState(proveedorProvincia);
    const [canton, setCanton] = useState(proveedorCanton);
    const [distrito, setDistrito] = useState(proveedorDistrito);

    const direccionesBodegas = {
        provincia: provincia,
        setProvincia: setProvincia,
        canton: canton,
        setCanton: setCanton,
        distrito: distrito,
        setDistrito: setDistrito
    }

    return (
        <>
            <Grid item xs={12} sm={4}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel>Provincia</InputLabel>
                    <Controller
                        name="provincia"
                        control={control}
                        render={({ field }) => (
                            <ProvinciaSelect
                                direcciones={direccionesBodegas}
                                field={field}
                            />
                        )}
                    />
                    <FormHelperText error={Boolean(errors.provincia)}>{errors.provincia?.message}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel>Cantón</InputLabel>
                    <Controller
                        name="canton"
                        control={control}
                        render={({ field }) => (
                            <CantonSelect
                                direcciones={direccionesBodegas}
                                field={field}
                                errors={errors}
                            />
                        )}
                    />
                    <FormHelperText error={Boolean(errors.canton)}>{errors.canton?.message}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel>Distrito</InputLabel>
                    <Controller
                        name="distrito"
                        control={control}
                        render={({ field }) => (
                            <DistritoSelect
                                direcciones={direccionesBodegas}
                                field={field}
                                errors={errors}
                            />
                        )}
                    />
                    <FormHelperText error={Boolean(errors.distrito)}>{errors.distrito?.message}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} lg={8}>
                <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
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
        </>
    )
}