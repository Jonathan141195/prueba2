import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Checkbox } from '@mui/material';
import  {toast } from 'react-hot-toast';
import HorarioService from '../../services/HorarioService';
import SucursalService from '../../services/SucursalService';
import SeleccionarSucursal from '../Form/SeleccionarSucursal';

export function CrearHorario() {
    const navigate = useNavigate();
    const [bloqueado, setBloqueado] = useState(false);
    const [sucursales, setSucursales] = useState([]);
    const [error, setError] = useState('');
    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
        const dd = String(today.getDate()).padStart(2, '0');
    
        return `${yyyy}-${mm}-${dd}`;
    };
    
    useEffect(() => {
        SucursalService.getSucursal()
            .then((response) => {
                if (response.data && response.data.results) {
                    setSucursales(response.data.results);
                } else {
                    throw new Error('Invalid response format');
                }
            })
            .catch((error) => {
                console.error('Error fetching sucursales:', error);
                setError(error.message);
            });
    }, []);

    const horarioSchema = yup.object({
        dia_semana: yup
        .date()
        .required('El día es requerido')
        .min(getCurrentDate(), 'La fecha no puede ser anterior a la actual'),
        hora_inicio: yup
          .string()
          .required('La hora de inicio es requerida')
          .test('hora-inicio-menor-hora-fin', 'La hora de inicio debe ser menor que la hora de fin', function(value) {
            const { hora_fin } = this.parent;
            if (!value || !hora_fin) return true; // Permitir si uno de los valores no está definido
            const inicio = new Date(`2000-01-01T${value}`);
            const fin = new Date(`2000-01-01T${hora_fin}`);
            return inicio < fin;
          }),
        hora_fin: yup
          .string()
          .required('La hora de fin es requerida'),
        sucursal_id: yup.number().required('La sucursal es requerida'),
      });
      
      
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            dia_semana: '',
            hora_inicio: '',
            hora_fin: '',
            sucursal_id: '',
            estado: 1, // Por defecto no bloqueado
        },
        resolver: yupResolver(horarioSchema),
    });

    const onSubmit = (formData) => {
        formData.estado = bloqueado ? 0 : 1;

        // Convertir las horas al formato HH:mm:ss si no lo están
        formData.hora_inicio = formData.hora_inicio.length === 5 ? formData.hora_inicio + ':00' : formData.hora_inicio;
        formData.hora_fin = formData.hora_fin.length === 5 ? formData.hora_fin + ':00' : formData.hora_fin;

        HorarioService.createHorario(formData)
        .then((response) => {
            console.log(response);
            if (response.status === 400 && response.results === 'El horario se solapa con uno existente') {
                // Mostrar una alerta o mensaje al usuario sobre la superposición
                alert('El horario se solapa con uno existente. Por favor, elige otro horario.');
                 // Mostrar mensaje de error específico al usuario
             toast.error('El horario se solapa con uno existente. Por favor, elige otro horario.');
            } else {
                toast.success(`Se creó correctamente`,{
                    duration: 4000,
                    position: 'top-center',
                });
                navigate('/mantenimientoHorario');
            }
        })
        .catch((error) => {
          // Mostrar mensaje de error genérico al usuario
         toast.error('El horario se solapa con uno existente. Por favor, elige otro horario..');
            console.error('Error al crear el horario:', error);
            // Manejar errores si es necesario
        });

    };

    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2} sx={{ mt: 6 }}>
                    <Grid item xs={12}>
                        <Typography variant='h5' gutterBottom>
                            Crear Horario
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl variant="standard" fullWidth>
                            <Controller
                                name="dia_semana"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="dia_semana"
                                        label="Fecha"
                                        type="date"
                                        variant="outlined"
                                        error={Boolean(errors.dia_semana)}
                                        helperText={errors.dia_semana ? errors.dia_semana.message : ' '}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl variant="standard" fullWidth>
                            <Controller
                                name="hora_inicio"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="hora_inicio"
                                        label="Hora de Inicio"
                                        type="time"
                                        variant="outlined"
                                        error={Boolean(errors.hora_inicio)}
                                        helperText={errors.hora_inicio ? errors.hora_inicio.message : ' '}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ step: 300 }} // 5 min
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl variant="standard" fullWidth>
                            <Controller
                                name="hora_fin"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="hora_fin"
                                        label="Hora de Fin"
                                        type="time"
                                        variant="outlined"
                                        error={Boolean(errors.hora_fin)}
                                        helperText={errors.hora_fin ? errors.hora_fin.message : ' '}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ step: 300 }} // 5 min
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <Controller
                            name="sucursal_id"
                            control={control}
                            render={({ field }) => (
                                <SeleccionarSucursal
                                    field={field}
                                    data={sucursales}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            )}
                        />
                        {errors.sucursal_id && (
                            <FormHelperText error>{errors.sucursal_id.message}</FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={bloqueado} onChange={(e) => setBloqueado(e.target.checked)} />}
                            label="Bloqueado"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type='submit'
                            variant='contained'
                            color='secondary'
                            sx={{ m: 1 }}
                        >
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
}











