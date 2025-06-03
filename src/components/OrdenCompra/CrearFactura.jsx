import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  FormHelperText,
  MenuItem,
  Container,
} from '@mui/material';
import  { useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import FacturaService from '../../services/FacturaService';
import UsuarioService from '../../services/UsuarioService';
import SucursalService from '../../services/SucursalService';
import toast from 'react-hot-toast';
import { DetalleFacturaForm } from '../OrdenCompra/Form/DetalleFacturaForm';

export function CrearFactura() {
  const navigate = useNavigate();
  const [dataServicio, setDataServicio] = useState([]);
  const [nextId, setNextId] = useState(0);
  const [loadedServicio, setLoadedServicio] = useState(false);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadedUsuario, setLoadedUsuario] = useState(false);
  const [dataSucursales, setDataSucursales] = useState([]);
  const [loadedSucursales, setLoadedSucursales] = useState(false);
  const [dataCliente, setDataCliente] = useState([]);
  const [loadedCliente, setLoadedCliente] = useState(false);
  const [dataencargado, setDataencargado] = useState([]);
  const [loadedencargado, setLoadedencargado] = useState(false);
  const codigo = 0;
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({ nombre: '', correo_electronico: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SucursalService.getSucursal();
        setDataSucursales(response.data.results);
        setLoadedSucursales(true);
      } catch (error) {
        console.error('Error fetching sucursales:', error);
        toast.error('Error al cargar sucursales');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (codigo === 0) {
      FacturaService.getNextId()
        .then((response) => {
          console.log("Próximo ID obtenido:", response.data.results.Codigo);
          setNextId(response.data.results.Codigo);
        })
        .catch((error) => {
          console.error("Error al obtener el próximo ID:", error);
          if (error instanceof SyntaxError) {
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    }
  }, [codigo]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await UsuarioService.getUsers();
        setDataUsuario(response.data.results);
        setLoadedUsuario(true);
      } catch (error) {
        console.error('Error fetching Usuario:', error);
        toast.error('Error al cargar Usuario');
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await UsuarioService.getallClientes();
        setDataCliente(response.data.results);
        setLoadedCliente(true);
      } catch (error) {
        console.error('Error fetching Cliente:', error);
        toast.error('Error al cargar Cliente');
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await UsuarioService.getallencargado();
        setDataencargado(response.data.results);
        setLoadedencargado(true);
      } catch (error) {
        console.error('Error fetching Cliente:', error);
        toast.error('Error al cargar Cliente');
      }
    }
    fetchData();
  }, []);



  useEffect(() => {
    FacturaService.allProductosServicios()
      .then((response) => {
        console.log('Datos de productos y servicios:', response.data.results);
        setDataServicio(response.data.results);
        setLoadedServicio(true);
      })
      .catch((error) => {
        console.error('Error al cargar productos y servicios:', error);
        if (error instanceof SyntaxError) {
          setError(error);
          setLoadedServicio(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  const facturaSchema = yup.object({
    fecha: yup.date().required('La fecha es requerida').typeError('Formato de fecha inválido'),
    cliente_id: yup.number().required('El cliente es requerido'),
    sucursal_id: yup.number().required('La sucursal es requerida'),
    total: yup.number().positive('El total debe ser un número positivo').required('El total es requerido'),
    detalle_factura: yup.array().of(
      yup.object().shape({
        producto_id: yup.string().nullable(),
        servicio_id: yup.string().nullable(),
        cantidad: yup.number().positive().required('La cantidad es requerida'),
        precio: yup.number().positive().required('El precio es requerido'),
        subtotal: yup.number().positive().required('El subtotal es requerido'),
      })
    ).required('Debe haber al menos un detalle de factura')
  });

  const today = new Date();
  const currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    
    formState: { errors }
  } = useForm({
    defaultValues: {
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
    resolver: yupResolver(facturaSchema),
  });

  useEffect(() => {
    // Actualiza la información del usuario seleccionado basado en `cliente_id`
    const selectedUser = dataCliente.find(user => user.id === watch('cliente_id'));
    if (selectedUser) {
      setUsuarioSeleccionado({ nombre: selectedUser.nombre, correo_electronico: selectedUser.correo_electronico });
    }
  }, [watch('cliente_id')]);

 
  const getSucursalByEncargado = async (encargado_id) => {
    try {
      console.log(`Llamando a getSucursalByEncargado con encargado_id: ${encargado_id}`);
      const response = await SucursalService.getSucursalbyEncargado(encargado_id);
      console.log(`Respuesta del servicio:`, response.data);
      return response.data.results[0]; // Acceder al primer elemento del array
    } catch (error) {
      console.error('Error obteniendo sucursal por encargado:', error);
      return null;
    }
  };
  
  useEffect(() => {
    const updateSucursalByEncargado = async (encargado_id) => {
      if (encargado_id) {
        const sucursal = await getSucursalByEncargado(encargado_id);
        if (sucursal) {
          console.log(`Actualizando sucursal_id con: ${sucursal.id}`);
          setValue('sucursal_id', sucursal.id);
        } else {
          console.log('No se encontró sucursal para el encargado:', encargado_id);
        }
      }
    };
  
    const subscription = watch(async (value, { name }) => {
      if (name === 'encargado_id') {
        console.log(`encargado_id cambiado a: ${value.encargado_id}`);
        await updateSucursalByEncargado(value.encargado_id);
      }
    });
  
    return () => subscription.unsubscribe();
  }, [watch, setValue]);
  

  const handleInputChange = useCallback((index, name, value) => {
    console.log(`Manejo de cambio - Índice: ${index}, Nombre: ${name}, Valor: ${value}`);
    
    let impuesto = 0;
    let subtotal = 0;
    let subtotaltotal = 0;
  
    if (dataServicio && value) {
      let item;
  
      if (name.includes('producto_id')) {
        item = dataServicio.find((item) => item.producto_id === value);
      } else if (name.includes('servicio_id')) {
        item = dataServicio.find((item) => item.servicio_id === value);
      }
  
      if (item) {
        console.log(`Item seleccionado: ${item.nombre}, Precio: ${item.precio}`);
        setValue(`detalle_factura.${index}.precio`, parseFloat(item.precio));
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
  
const { fields, append, remove } = useFieldArray({
  control,
  name: 'detalle_factura',
});

const removeDetalleFactura = useCallback((index) => {
  if (fields.length > 1) {
    console.log(`Eliminando detalle en índice: ${index}`);
    remove(index);
  } else {
    console.log('No se puede eliminar el único detalle presente');
  }
}, [fields.length, remove]);

const addNewDetalleFactura = useCallback(() => {
  console.log('Añadiendo nuevo detalle de factura');
  append({
    producto_id: '',
    servicio_id: '',
    cantidad: 1,
    precio: 0,
    subtotal: 0,
  });
}, [append]);



  const [onError, setError] = useState('');

  // Acción submit
  const onSubmit = (DataForm) => {
    DataForm.date=`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    console.log('Formulario:');
    console.log(DataForm);

    try {
      if (facturaSchema.isValid()) {
        // Crear reserva
        FacturaService.createFactura(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);
            // Respuesta al usuario de creación
            if (response.data.results != null) {
              toast.success(response.data.results, {
                duration: 4000,
                position: 'top-center',
              });
              // Redireccion a la tabla
              return navigate('/orden');
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
      // Capturar error
    }
  };

  return (
    <Container maxWidth="lg"> {/* Cambiado a lg para mayor ancho */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <div style={{ marginTop: '60px' }}></div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              Crear Factura
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='fecha'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='fecha'
                    label='Fecha'
                    error={Boolean(errors.fecha)}
                    helperText={errors.fecha ? errors.fecha.message : ' '}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='id'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='id'
                    label='ID'
                    error={Boolean(errors.id)}
                    helperText={errors.id ? errors.id.message : ''}
                    value={nextId}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name="cliente_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Cliente"
                    variant="outlined"
                    fullWidth
                  >
                    {dataCliente.map((usuario) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormHelperText>{errors.cliente_id?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <TextField
                label='Nombre de Cliente'
                value={usuarioSeleccionado.nombre}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <TextField
                label='Email de Cliente'
                value={usuarioSeleccionado.correo_electronico}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name="encargado_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Encargado"
                    variant="outlined"
                    fullWidth
                  >
                    {dataencargado.map((usuario) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormHelperText>{errors.cliente_id?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name="sucursal_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Sucursal"
                    variant="outlined"
                    fullWidth
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
              <FormHelperText>{errors.sucursal_id?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Detalles de la Factura
              <Tooltip title='Agregar Detalle'>
                <span>
                  <IconButton color='secondary' onClick={addNewDetalleFactura}>
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
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
                    <TableCell>Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadedServicio &&
                    fields.map((field, index) => (
                      <DetalleFacturaForm
                        key={field.id}
                        field={field}
                        data={dataServicio}
                        index={index}
                        onRemove={removeDetalleFactura}
                        handleChange={handleInputChange}
                        control={control}
                        disableRemoveButton={fields.length === 1}
                        
                        
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
            <Button type='submit' variant='contained' color='primary'>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}


