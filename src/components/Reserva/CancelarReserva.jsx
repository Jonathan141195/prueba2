import { useEffect, useState, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { DetalleFacturaFormUpdate } from '../Reserva/Form/DetalleFacturaFormupdate';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import UsuarioService from '../../services/UsuarioService';
import SucursalService from '../../services/SucursalService';
import ServicioService from '../../services/ServicioService';
import toast from 'react-hot-toast';
import HorarioService from '../../services/HorarioService';
import ReservaService from '../../services/ReservaService';
import DatePicker from 'react-datepicker';
import {
    Container,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow
} from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import '../Reserva/DatePickerCustomStyles.css';

// Esquema de validación con Yup
const reservaSchema = yup.object().shape({
    sucursal_id: yup.string().required('La sucursal es requerida'),
   
    servicio_id: yup.string().required('El servicio es requerido'),
    question1: yup.string().required('La pregunta 1 es requerida'),
    question2: yup.string().required('La pregunta 2 es requerida'),
    question3: yup.string().required('La pregunta 3 es requerida'),
    answer1: yup.string().required('La respuesta 1 es requerida'),
    answer2: yup.string().required('La respuesta 2 es requerida'),
    answer3: yup.string().required('La respuesta 3 es requerida'),
    cliente_id: yup.string().required('El usuario es requerido'),
    tiempo_servicio: yup.number().required('El tiempo de servicio es requerido').positive('El tiempo de servicio debe ser positivo').integer('El tiempo de servicio debe ser un número entero'),
    dia: yup
        .date()
        .required('El día es requerido')
        .test('is-cancellable', 'No se puede cancelar con menos de 24 horas de antelación', function(value) {
            const currentDate = new Date();
            return value && new Date(value).getTime() - currentDate.getTime() > 24 * 60 * 60 * 1000;
        }),
});

export function CancelarReserva() {
    const navigate = useNavigate();
    const routeParams = useParams();
    const id = routeParams.id || null;

    const [dataServicio, setDataServicio] = useState([]);
    const [loadedServicio, setLoadedServicio] = useState(false);
    const [dataUsuario, setDataUsuario] = useState([]);
    const [dataSucursales, setDataSucursales] = useState([]);
    const [dataencargado, setDataencargado] = useState([]);
    const [dataCliente, setDataCliente] = useState([]);
    const [dataHorarios, setDataHorarios] = useState([]);
    const [selectedHorarios, setSelectedHorarios] = useState([]);
   
    const [tiempoServicio, setTiempoServicio] = useState('');
    const [error, setError] = useState('');
    const today = new Date();
    const currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const {
      control,
      handleSubmit,
      setValue,
      watch,
      getValues,
      formState: { errors }
    } = useForm({
      defaultValues: {
        id:id,
      estado_Reserva: 'Cancelada',
      servicio_id: '',
      question1: '¿Cuál es la marca y modelo de su vehículo?',
      question2: '¿Ha notado algún problema reciente con su vehículo?',
      question3: '¿Hace cuánto tiempo fue el último mantenimiento?',
      answer1: '',
      answer2: '',
      answer3: '',
      tiempo_servicio: '',
      horario_id: [],
      fecha: currentDate,
      cliente_id: '',
      encargado_id: '',
      sucursal_id: '',
      total: 0,
      subtotaltotal: 0,
      impuesto: 0,
      estado: 0,
      detalle_factura: [
        {
          producto_id: '',
          servicio_id: '',
          cantidad: 1,
          precio: 0,
          subtotal: 0,
        },
      ],
    },
    
    resolver: yupResolver(reservaSchema),
    context: { horarios: dataHorarios },
  });
  
  

    useEffect(() => {
        if (id !== undefined && !isNaN(Number(id))) {
            ReservaService.getReservaId(Number(id))
                .then(async (response) => {
                    const reserva = response.data.results[0];
                    const sucursalId = reserva.horario[0]?.sucursal_id || '';
                    const servicioId = reserva.servicio_id;
                    const dia = new Date(reserva.horario[0]?.dia_semana);

                    setValue('sucursal_id', sucursalId);
                    setValue('servicio_id', servicioId);
                    setValue('dia', dia);
                    setValue('cliente_id', reserva.cliente_id);
                    setValue('encargado_id', reserva.encargado_id);
                    setValue('estado', reserva.estado);
                    setValue('question1', reserva.question1);
                    setValue('question2', reserva.question2);
                    setValue('question3', reserva.question3);
                    setValue('answer1', reserva.answer1);
                    setValue('answer2', reserva.answer2);
                    setValue('answer3', reserva.answer3);
                    setValue('horario_id', reserva.horario.map(h => h.horario_id));
                    setSelectedHorarios(reserva.horario.map(h => h.horario_id));

                    const responseTiempoServicio = await ServicioService.get_tiempoServicio(servicioId);
                    const tiempo = parseInt(responseTiempoServicio.data.results.tiempo_servicio, 10);
                    setValue('tiempo_servicio', tiempo);

                    // Load horarios
                    const horarios = await HorarioService.getHorarioBySucursalall(dia, sucursalId);
                    setDataHorarios(horarios);
                })
                .catch((error) => {
                    console.error('Error al obtener la reserva:', error);
                    toast.error('Error al obtener la reserva');
                });
        }
    }, [id, setValue]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [usuarios, sucursales, servicios, clientes, encargados] = await Promise.all([
                    UsuarioService.getUsers(),
                    SucursalService.getSucursal(),
                    ServicioService.getServicio(),
                    UsuarioService.getallClientes(),
                    UsuarioService.getallencargado()
                ]);

                setDataUsuario(usuarios.data.results);
                setDataSucursales(sucursales.data.results);
                setDataServicio(servicios.data.results);
                setDataCliente(clientes.data.results);
                setDataencargado(encargados.data.results);
                setLoadedServicio(true);
            } catch (error) {
                toast.error('Error al cargar datos iniciales');
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const reservaValues = getValues();
        if (reservaValues.sucursal_id && reservaValues.dia) {
            handleDiaChange(reservaValues.dia, reservaValues.sucursal_id);
        }
    }, [getValues]);

    const handleSucursalChange = async (event) => {
        const sucursalId = event.target.value;
        setValue('sucursal_id', sucursalId);
        setValue('dia', null);
        setValue('horario_id', []);

        const diaSeleccionado = getValues('dia');
        if (diaSeleccionado) {
            try {
                const horarios = await HorarioService.getHorarioBySucursalall(diaSeleccionado, sucursalId);
                setDataHorarios(horarios.length > 0 ? horarios : []);
                if (horarios.length === 0) toast.error('No se encontraron horarios para la sucursal seleccionada y el día especificado');
            } catch (error) {
                toast.error('Error al cargar horarios');
            }
        }
    };

    const handleDiaChange = async (date) => {
        setValue('dia', date);
        setValue('horario_id', []);
        setSelectedHorarios([]);

        const sucursalId = getValues('sucursal_id');
        if (sucursalId) {
            try {
                const horarios = await HorarioService.getHorarioBySucursalall(date, sucursalId);
                setDataHorarios(horarios.length > 0 ? horarios : []);
                if (horarios.length === 0) toast.error('No se encontraron horarios para la sucursal seleccionada y el día especificado');
            } catch (error) {
                toast.error('Error al cargar horarios');
            }
        }
    };

    const handleCheckboxChange = (horario_id) => {
        const updatedSelection = selectedHorarios.includes(horario_id)
            ? selectedHorarios.filter(id => id !== horario_id)
            : [...selectedHorarios, horario_id];

        setSelectedHorarios(updatedSelection);
        setValue('horario_id', updatedSelection);
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'detalle_factura',
    });

    useEffect(() => {
        async function fetchTiempoServicio(servicioId) {
            try {
                const response = await ServicioService.get_tiempoServicio(servicioId);
                const tiempo = parseInt(response.data.results.tiempo_servicio, 10);
                setTiempoServicio(tiempo);
            } catch (error) {
                console.error('Error al obtener tiempo de servicio:', error);
                toast.error('Error al obtener tiempo de servicio');
            }
        }

        const servicioId = getValues('servicio_id');
        if (servicioId) fetchTiempoServicio(servicioId);
    }, [getValues('servicio_id')]);

    
    const handleInputChange = useCallback((index, name, value) => {
      console.log(`Manejo de cambio - Índice: ${index}, Nombre: ${name}, Valor: ${value}`);
      
      let impuesto = 0;
      let subtotal = 0;
      let subtotaltotal = 0;
      if (dataServicio && value) {
        let item =dataServicio.find((item) => item.id === value);
  
        if (item) {
          console.log(`Item seleccionado: ${item.nombre}, Precio: ${item.tarifa}`);
          setValue(`detalle_factura.${index}.precio`, parseFloat(item.tarifa));
        }
      }
      
      const currentDetalleFactura = watch('detalle_factura');
    
      if (currentDetalleFactura[index]) {
        subtotal = parseFloat(currentDetalleFactura[index].cantidad) * parseFloat(currentDetalleFactura[index].precio || 0);
        console.log(`Subtotal calculado para el índice ${index}: ${subtotal}`);
        setValue(`detalle_factura.${index}.subtotal`, subtotal);
      }
    
      subtotaltotal = currentDetalleFactura.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);
      console.log(`Subtotal total: ${subtotaltotal}`);
      setValue('subtotaltotal', subtotaltotal);
    
      impuesto = subtotaltotal * 0.13;
      console.log(`Impuesto total: ${impuesto}`);
      setValue('impuesto', impuesto);
    
      const total = subtotaltotal + impuesto;
      console.log(`Total calculado: ${total}`);
      setValue('total', total);
    }, [dataServicio, setValue, watch]);
    
  
  // Sincronizar servicio_id en detalle_factura cuando cambia servicio_id en la reserva principal
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'servicio_id') {
        const servicio_id = value.servicio_id;
        fields.forEach((field, index) => {
          setValue(`detalle_factura.${index}.servicio_id`, servicio_id);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, fields, setValue]);
  
  
  const removeDetalleFactura = useCallback((index) => {
    if (fields.length > 1) {
      console.log(`Eliminando detalle en índice: ${index}`);
      remove(index);
    } else {
      console.log('No se puede eliminar el único detalle presente');
    }
  }, [fields.length, remove]);
  
  const onSubmit = (DataForm) => {
    console.log('Formulario:');
    console.log(DataForm);

    try {
      if (reservaSchema.isValid()) {
        //Crear pelicula
        ReservaService.updateReserva(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);
            //Respuesta al usuario de creación
            if (response.data.results != null) {
              toast.success(response.data.results, {
                duration: 4000,
                position: 'top-center',
              });
              // Redireccion a la tabla
              return navigate('/ListaReservas');
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error('Respuesta no válida del servidor');
            }
          });
      }
    } catch (e) {
      //Capturar error
    }
  };


    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>Cancelar Reserva</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Controller
                                    name="sucursal_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Sucursal"
                                            onChange={handleSucursalChange}
                                            error={Boolean(errors.sucursal_id)}
                                            helperText={errors.sucursal_id?.message}
                                            InputProps={{ readOnly: true }}
                                        >
                                            {dataSucursales.map((sucursal) => (
                                                <MenuItem key={sucursal.id} value={sucursal.id}>
                                                    {sucursal.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Controller
                                    name="dia"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value ? new Date(field.value) : null}
                                            onChange={(date) => handleDiaChange(date)}
                                            dateFormat="yyyy/MM/dd"
                                            placeholderText="Seleccionar fecha"
                                            customInput={<TextField fullWidth />}
                                            disabled // Esta propiedad deshabilita el DatePicker
                                        />
                                    )}
                                />
                                {errors.dia && <FormHelperText error>{errors.dia.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Horarios Disponibles</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Seleccionar</TableCell>
                                            <TableCell>Hora Inicio</TableCell>
                                            <TableCell>Hora Fin</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataHorarios.map((horario) => (
                                            <TableRow key={horario.id}>
                                                <TableCell>
                                                    <FormControlLabel
                                                    
                                                        control={
                                                            <Checkbox
                                                                checked={selectedHorarios.includes(horario.id)}
                                                                onChange={() => handleCheckboxChange(horario.id)}
                                                                disabled // Esta propiedad deshabilita el checkbox
                                                            />
                                                        }
                                                        label=""
                                                    />
                                                </TableCell>
                                                <TableCell>{horario.hora_inicio}</TableCell>
                                                <TableCell>{horario.hora_fin}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="cliente_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Cliente"
                                            error={Boolean(errors.cliente_id)}
                                            helperText={errors.cliente_id?.message}
                                            InputProps={{ readOnly: true }}
                                        >
                                            {dataCliente.map((cliente) => (
                                                <MenuItem key={cliente.id} value={cliente.id}>
                                                    {cliente.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="encargado_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Encargado"
                                            error={Boolean(errors.encargado_id)}
                                            helperText={errors.encargado_id?.message}
                                            InputProps={{ readOnly: true }}
                                        >
                                            {dataencargado.map((encargado) => (
                                                <MenuItem key={encargado.id} value={encargado.id}>
                                                    {encargado.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="servicio_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Servicio"
                                            error={Boolean(errors.servicio_id)}
                                            helperText={errors.servicio_id?.message}
                                            InputProps={{ readOnly: true }}
                                        >
                                            {dataServicio.map((servicio) => (
                                                <MenuItem key={servicio.id} value={servicio.id}>
                                                    {servicio.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="question1"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Pregunta 1"
                                            error={Boolean(errors.question1)}
                                            helperText={errors.question1?.message}
                                            InputProps={{ readOnly: true }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="question2"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Pregunta 2"
                                            error={Boolean(errors.question2)}
                                            helperText={errors.question2?.message}
                                            InputProps={{ readOnly: true }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="question3"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Pregunta 3"
                                            error={Boolean(errors.question3)}
                                            helperText={errors.question3?.message}
                                            InputProps={{ readOnly: true }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="answer1"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Respuesta 1"
                                            error={Boolean(errors.answer1)}
                                            helperText={errors.answer1?.message}
                                            InputProps={{ readOnly: true }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="answer2"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Respuesta 2"
                                            error={Boolean(errors.answer2)}
                                            helperText={errors.answer2?.message}
                                            InputProps={{ readOnly: true }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="answer3"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Respuesta 3"
                                            error={Boolean(errors.answer3)}
                                            helperText={errors.answer3?.message}
                                            InputProps={{ readOnly: true }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Detalles de la Factura
              
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label='Detalles de Factura'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'success.main' }}>
                    <TableCell>#</TableCell>
                    <TableCell style={{ width: 400 }}>Producto/Servicio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Subtotal</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadedServicio &&
                    fields.map((field, index) => (
                      <DetalleFacturaFormUpdate
                      key={field.id}
                      field={field}
                      data={dataServicio}
                      index={index}
                      onRemove={removeDetalleFactura}
                      handleChange={handleInputChange}
                      control={control}
                      disableRemoveButton={fields.length === 0}
                      servicioSeleccionado={watch(`detalle_factura.${index}.servicio_id`)}
                      />
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ borderTop: 'solid', borderColor: 'success.main' }}>
                    <TableCell colSpan={4} align='right' sx={{ fontWeight: 'bold' }}>
                      Subtotal
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Controller
                        name='subtotaltotal'
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type='number' variant='standard' fullWidth InputProps={{ readOnly: true }} />
                        )}
                      />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow sx={{ borderTop: 'solid', borderColor: 'success.main' }}>
                    <TableCell colSpan={4} align='right' sx={{ fontWeight: 'bold' }}>
                      Impuesto
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Controller
                        name='impuesto'
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type='number' variant='standard' fullWidth InputProps={{ readOnly: true }} />
                        )}
                      />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow sx={{ borderTop: 'solid', borderColor: 'success.main' }}>
                    <TableCell colSpan={4} align='right' sx={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Controller
                        name='total'
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type='number' variant='standard' fullWidth InputProps={{ readOnly: true }} />
                        )}
                      />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>   
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Cancelar Reserva
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

