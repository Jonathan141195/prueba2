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
import CategoriaService from '../../services/CategoriaService';
import ProductoService from '../../services/ProductoService';
import { toast } from 'react-hot-toast';
import { SeleccionarCategoria } from '../Form/SeleccionarCategoria';

export function CreateProducto() {
  const navigate = useNavigate();
  const codigo = 0;
  const [nextId, setNextId] = useState(codigo);

  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    marca: yup.string().required('La marca es requerida'),
    modelo: yup.string().required('El modelo es requerido'),
    precio: yup.number()
      .typeError('Solo acepta números')
      .required('El precio es requerido')
      .positive('Solo acepta números positivos'),
    Categoria_id: yup.number().typeError('Seleccione una categoría').required('La categoría es requerida'),
  });

  const {
    control,
    handleSubmit,
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
    resolver: yupResolver(productoSchema),
  });

  const [error, setError] = useState('');
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (DataForm) => {
    console.log('Formulario:', DataForm);

    try {
      if (productoSchema.isValid()) {
        ProductoService.createProducto(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);
            if (response.data.results != null) {
              toast.success(response.data.results, {
                duration: 4000,
                position: 'top-center',
              });
              navigate('/listaProducto');
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
      console.error(e);
    }
  };

  // Lista de Categorias
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

  useEffect(() => {
    if (codigo === 0) {
      ProductoService.getNextId()
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

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant='h5' gutterBottom>
              Crear Producto
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='nombre'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='nombre'
                    label='Nombre'
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='descripcion'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='descripcion'
                    label='Descripción'
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion ? errors.descripcion.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='marca'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='marca'
                    label='Marca'
                    error={Boolean(errors.marca)}
                    helperText={errors.marca ? errors.marca.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='modelo'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='modelo'
                    label='Modelo'
                    error={Boolean(errors.modelo)}
                    helperText={errors.modelo ? errors.modelo.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='precio'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='precio'
                    label='Precio'
                    error={Boolean(errors.precio)}
                    helperText={errors.precio ? errors.precio.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              {loadedCategoria && 
              <Controller
                name='Categoria_id'
                control={control}
                render={({field})=>(
                  <SeleccionarCategoria
                    field={field}
                    data={dataCategoria}
                    error={Boolean(errors.Categoria_id)}
                  />
                )}
              />}
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.Categoria_id ? errors.Categoria_id.message : ' '}
              </FormHelperText>
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
                  />
                )}
              />
            </FormControl>
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



