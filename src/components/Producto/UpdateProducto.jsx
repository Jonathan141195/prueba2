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
import { useNavigate, useParams } from 'react-router-dom';
import ProductoService from '../../services/ProductoService';
import { toast } from 'react-hot-toast';
import CategoriaService from '../../services/CategoriaService';

import { SeleccionarCategoria } from '../Form/SeleccionarCategoria';

//https://www.npmjs.com/package/@hookform/resolvers

export function UpdateProducto() {
  const navigate = useNavigate();
  const routeParams=useParams();
  //Id de la pelicula a actualizar
  const id= routeParams.id || null;
  //Valores a precargar en el formulario, vienen del API
  const [values,setValores]=useState(null);
  //Obtener la pelicula del API
  useEffect(() => {
    if(id!=undefined && !isNaN(Number(id))){
    ProductoService.getProductoId(Number(id))
      .then((response) => { 
        console.log('Producto')
        console.log(response)
        
        
        setValores(response.data.results);
        setError(response.error);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          
          throw new Error('Respuesta no válida del servidor');
        }
      });
    }
  }, [id]);

  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup
      .string()
      .required('El nombre es requerido')
      .min(2, 'El nombre debe tener 2 caracteres'),
    descripcion: yup.string().required('La descripcion es requerida'),
    precio: yup
      .number()
      .typeError('Solo acepta números')
      .required('El precio es requerido')
      .positive('Solo acepta numeros positivos'),
    marca: yup.string().required('La Marca es requerida'),
    modelo: yup.string().required('El modelo es requerido'),
    Categoria_id: yup
      .number()
      .typeError('La Categoria es requerida')
      .required('La Categoria es requerida'),
    
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      marca: '',
      modelo: '',
      precio: '',
      Categoria_id: '',
    
    },
    //Valores a precargar en el formulario
    values,
    // Asignación de validaciones
    resolver: yupResolver(productoSchema),
  });
  
  const [error, setError] = useState('');

  // Accion submit
  const onSubmit = (DataForm) => {
    console.log('Formulario:');
    console.log(DataForm);

    try {
      if (productoSchema.isValid()) {
        //Crear pelicula
        ProductoService.updateProducto(DataForm)
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
              return navigate('/mantenimientoProducto');
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

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  //Lista de Directores
  const [dataCategoria, setDataCategoria] = useState({});
  const [loadedCategoria, setLoadedCategoria] = useState(false);
  useEffect(() => {
     CategoriaService.getCategoria()
      .then((response) => {
        console.log(response);
        setDataCategoria(response.data.results);
        setLoadedCategoria(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedCategoria(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);
 
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <Grid container spacing={2} sx={{ mt: 6 }}>
      <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Actualizar Producto
            </Typography>
          </Grid>
          <Grid item xs={2} sm={1}>
            {/* ['filled','outlined','standard']. */}
            <FormControl variant="standard" fullWidth>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="id"
                    InputProps={{
                        readOnly: true,
                      }}
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* ['filled','outlined','standard']. */}
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
                    helperText={errors.nombre ? errors.nombre.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl variant="standard" fullWidth>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="descripcion"
                    label="Descripcion"
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion ? errors.descripcion.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* ['filled','outlined','standard']. */}
            <FormControl variant="standard" fullWidth>
              <Controller
                name="marca"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="marca"
                    label="Marca"
                    error={Boolean(errors.marca)}
                    helperText={errors.marca ? errors.marca.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
          <FormControl variant="standard" fullWidth>
              <Controller
                name="modelo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="modelo"
                    label="Modelo"
                    error={Boolean(errors.modelo)}
                    helperText={errors.modelo ? errors.modelo.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
          <FormControl variant="standard" fullWidth>
              <Controller
                name="precio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="precio"
                    label="Precio"
                    error={Boolean(errors.precio)}
                    helperText={errors.precio ? errors.precio.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
          <FormControl variant="standard" fullWidth>
              {/* Lista de directores */}
              {loadedCategoria && (
                <Controller
                  name="Categoria_id"
                  control={control}
                  render={({ field }) => (
                    <SeleccionarCategoria
                      field={field}
                      data={dataCategoria}
                      error={Boolean(errors.Categoria_id)}
                      onChange={(e) =>
                        setValue('Categoria_id', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                />
              )}
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.director_id ? errors.director_id.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
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
