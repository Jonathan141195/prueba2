/* eslint-disable react/prop-types */
import { Controller, useFieldArray } from "react-hook-form";
import { useCallback, useEffect } from "react";
import {
    FormControl,
    Grid,
    IconButton,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export const ContactosProveedor = ({ control, contactos, errors }) => {
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "listaContactos",
    });

    const seedContactos = useCallback(() => replace(contactos ?? []), [contactos, replace])

    const removeContacto = (index) => {
        if (fields.length === 0) {
            return;
        }
        remove(index);
    };

    const addNewContacto = () => {
        append({
            id: "",
            nombre: "",
            telefono: "",
        });
    };

    useEffect(() => {
        seedContactos()
    }, [seedContactos])

    return (
        <Grid item xs={12}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                    Contactos
                    <Tooltip title="Agregar Contacto">
                        <IconButton color="secondary" onClick={addNewContacto}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <FormControl variant="standard" fullWidth >
                    {/* Mapear los campos de contacto */}
                    {fields.map((contacto, index) => (
                        <Grid container spacing={2} key={contacto.id} sx={{ mt: 1, mb: 1 }}>
                            <Grid item xs={6}>
                                <FormControl variant="standard" fullWidth>
                                    <Controller
                                        name={`listaContactos[${index}].nombre`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id={`nombre-${index}`}
                                                label="Nombre"
                                                error={Boolean(
                                                    errors.listaContactos?.[index]?.nombre
                                                )}
                                                helperText={
                                                    errors.listaContactos?.[index]?.nombre
                                                        ?.message || ""
                                                }
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl variant="standard" fullWidth>
                                    <Controller
                                        name={`listaContactos[${index}].telefono`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id={`telefono-${index}`}
                                                label="Teléfono"
                                                error={Boolean(
                                                    errors.listaContactos?.[index]?.telefono
                                                )}
                                                helperText={
                                                    errors.listaContactos?.[index]?.telefono
                                                        ?.message || ""
                                                }
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl variant="standard" fullWidth>
                                    <Controller
                                        name={`listaContactos[${index}].correo`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id={`correo-${index}`}
                                                label="Correo Electrónico"
                                                error={Boolean(
                                                    errors.listaContactos?.[index]?.correo
                                                )}
                                                helperText={
                                                    errors.listaContactos?.[index]?.correo
                                                        ?.message || ""
                                                }
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <Tooltip title="Eliminar contacto">
                                    <IconButton
                                        onClick={() => removeContacto(index)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    ))}
                </FormControl>
            </Grid>
        </Grid>

    )
}