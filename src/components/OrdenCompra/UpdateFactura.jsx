import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import UsuarioService from '../../services/UsuarioService';
import SucursalService from '../../services/SucursalService';
import toast from 'react-hot-toast';
import { DetalleFacturaForm } from '../OrdenCompra/Form/DetalleFacturaForm';
import FacturaService from '../../services/FacturaService';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    MenuItem,
    Container,
  } from '@mui/material';


//https://www.npmjs.com/package/@hookform/resolvers

export function UpdateFactura() {
  const navigate = useNavigate();
  const routeParams=useParams();
  const [dataServicio, setDataServicio] = useState([]);
  const [loadedServicio, setLoadedServicio] = useState(false);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadedUsuario, setLoadedUsuario] = useState(false);
  const [dataSucursales, setDataSucursales] = useState([]);
  const [loadedSucursales, setLoadedSucursales] = useState(false);
  const [dataencargado, setDataencargado] = useState([]);
  const [loadedencargado, setLoadedencargado] = useState(false);
  
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({ nombre: '', correo_electronico: '' });
  const [dataCliente, setDataCliente] = useState([]);
  const [loadedCliente, setLoadedCliente] = useState(false);
  //Id de la pelicula a actualizar
  const id= routeParams.id || null;
  //Valores a precargar en el formulario, vienen del API
  const [values,setValores]=useState(null);
  //Obtener la pelicula del API
  
  
          useEffect(() => {
            if (id != undefined && !isNaN(Number(id))) {
              FacturaService.getFacturaById(Number(id))
                .then((response) => {
                  const data = response.data.results;
          
                  const detalle_factura = data.detalle_factura.map(item => ({
                    factura_id: item.factura_id,
                    producto_id: item.producto_id,
                    servicio_id: item.servicio_id,
                    cantidad: item.cantidad,
                    subtotal: item.subtotal,
                    precio: item.precio,
                    producto: item.producto ? {
                      id: item.producto.id,
                      nombre: item.producto.nombre,
                      descripcion: item.producto.descripcion,
                      precio: item.producto.precio,
                      marca: item.producto.marca,
                      modelo: item.producto.modelo,
                      Categoria_id: item.producto.Categoria_id,
                      Categoria: item.producto.Categoria,
                    } : null,
                    servicio: item.servicio ? {
                      id: item.servicio.id,
                      nombre: item.servicio.nombre,
                      descripcion: item.servicio.descripcion,
                      tarifa: item.servicio.tarifa,
                      tiempo_servicio: item.servicio.tiempo_servicio,
                      tipo_vehiculo: item.servicio.tipo_vehiculo,
                      nivel_dificultad: item.servicio.nivel_dificultad,
                    } : null,
                  }));
          
                  const formattedData = {
                    id: data.id,
                    fecha: data.fecha,
                    cliente_id: data.cliente_id,
                    encargado_id: data.encargado_id,
                    sucursal_id: data.sucursal_id,
                    total: data.total,
                    estado: 1, // Estableciendo el estado en 1
                    impuesto: data.impuesto,
                    subtotaltotal: data.subtotaltotal,
                    usuario: data.usuario,
                    sucursal: data.sucursal,
                    detalle_factura,
                  };
          
                  setValores(formattedData);
                  setLoadedServicio(true);
                  setError(null);
                 
                 
                })
                .catch((error) => {
                  console.error('Error al obtener factura:', error);
                  if (error instanceof SyntaxError) {
                    setError('Respuesta no válida del servidor');
                  } else {
                    setError('Error al obtener factura');
                  }
                });
            }
          }, [id]);
          
  

  // Esquema de validación
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
 


  const {
    control,
    handleSubmit,
    setValue,
    watch,
   
    formState: { errors }
  } = useForm({
    defaultValues: {
      fecha: "",
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
    values,
    resolver: yupResolver(facturaSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalle_factura',
  });
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
    // Actualiza la información del usuario seleccionado basado en `cliente_id`
    const selectedUser = dataUsuario.find(user => user.id === watch('cliente_id'));
    if (selectedUser) {
      setUsuarioSeleccionado({ nombre: selectedUser.nombre, correo_electronico: selectedUser.correo_electronico });
    }
  }, [watch('cliente_id')]);
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
  
  const watchdetalle_factura = watch('detalle_factura');

  const handleInputChange = (index, name, value) => {
    console.log(`Manejo de cambio - Índice: ${index}, Nombre: ${name}, Valor: ${value}`);
    if (name === `detalle_factura.${index}.cantidad` && value === 0) {
        remove(index);
        return;
      }
    let impuesto = 0;
    let subtotal = 0;
    let subtotaltotal = 0;

    if (dataServicio && value) {
      // Encontrar el producto o servicio basado en el idOriginal
      let item = null;
      if (name === `detalle_factura.${index}.producto_id`) {
        item = dataServicio.find((item) => item.id === value && item.tipo === 'Producto');
      } else if (name === `detalle_factura.${index}.servicio_id`) {
        item = dataServicio.find((item) => item.id === value && item.tipo === 'Servicio');
      }
      
      // Si el item es encontrado, actualizar el precio
      if (item) {
        console.log(`Item seleccionado: ${item.nombre}, Precio: ${item.precio}`);
        setValue(`detalle_factura.${index}.precio`, parseFloat(item.precio));
      }
    }
    

    // Calcula el subtotal si hay un detalle en el índice especificado
    if (watchdetalle_factura[index]) {
      subtotal = parseFloat(watchdetalle_factura[index].cantidad) * parseFloat(watchdetalle_factura[index].precio || 0);
      console.log(`Subtotal calculado para el índice ${index}: ${subtotal}`);
      setValue(`detalle_factura.${index}.subtotal`, subtotal);
    }

    // Calcula el subtotal total de todos los items
    subtotaltotal = watchdetalle_factura.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);
    console.log(`Subtotal total: ${subtotaltotal}`);
    setValue('subtotaltotal', subtotaltotal);

    // Calcula el impuesto total (13% del subtotal total)
    impuesto = subtotaltotal * 0.13;
    console.log(`Impuesto total: ${impuesto}`);
    setValue('impuesto', impuesto);

    // Calcula el total (subtotal total + impuesto)
    const total = subtotaltotal + impuesto;
    console.log(`Total calculado: ${total}`);
    setValue('total', total);
  };

  const removeDetalleFactura = (index) => {
    if (fields.length > 1) {
      console.log(`Eliminando detalle en índice: ${index}`);
      remove(index);
    } else {
      console.log('No se puede eliminar el único detalle presente');
    }
  };

  const addNewDetalleFactura = () => {
    console.log('Añadiendo nuevo detalle de factura');
    append({
      producto_id: '',
      servicio_id: '',
      cantidad: 1,
      precio: 0,
      subtotal: 0,
    });
  };
  const [error, setError] = useState('');

  // Accion submit
  const onSubmit = (DataForm) => {
    console.log('Formulario:');
    console.log(DataForm);

    try {
      if (facturaSchema.isValid()) {
        //Crear pelicula
        FacturaService.updateFactura(DataForm)
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
      //Capturar error
    }
  };
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
 

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <Container maxWidth="lg"> {/* Cambiado a lg para mayor ancho */}
      <form onSubmit={handleSubmit(onSubmit, Error)} noValidate>
      <div style={{ marginTop: '60px' }}></div>
      <Grid container spacing={3}>
       <Grid item xs={12}>
       
            <Typography variant="h4" gutterBottom>
              Actualizar Factura
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
                    label=''
                    error={Boolean(errors.id)}
                    helperText={errors.id ? errors.id.message : ''}
                    
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
                fullWidth
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
          <FormControl variant='standard' fullWidth>
            <Controller
              name="cliente_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Usuario"
                  variant="outlined"
                >
                  {dataCliente.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <FormHelperText>{errors.cliente_id_id?.message}</FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
        <FormControl variant='standard' fullWidth>
              <TextField
                label='Nombre de Usuario'
                value={usuarioSeleccionado.nombre}
                InputProps={{ readOnly: true }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl variant='standard' fullWidth>
              <TextField
                label='Email de Usuario'
                value={usuarioSeleccionado.correo_electronico}
                InputProps={{ readOnly: true }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
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
                >
                  {dataencargado.map((encargado) => (
                    <MenuItem key={encargado.id} value={encargado.id}>
                      {encargado.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <FormHelperText>{errors.encargado_id?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} >
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
        <Grid item xs={12} >
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
            <FormControl variant='standard' fullWidth sx={{ m: 1 }}>
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
                          onChange={(e) =>
                            setValue('detalle_factura', e.target.value, {
                              shouldValidate: true,
                            })
                          }
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
            </FormControl>
          </Grid>
          
          <Grid item xs={12} >
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              Facturar
            </Button>
          </Grid>
        </Grid>
      </form>
      </Container>
    </>
  );
}
