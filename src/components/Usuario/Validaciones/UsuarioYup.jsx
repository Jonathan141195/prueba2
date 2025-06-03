import * as yup from "yup";

export const yupUsuario = yup.object().shape({
    nombre: yup.string().required("El nombre es requerido"),
    identificacion: yup.string().required("La identificación es requerida"),
    correo_electronico: yup.string().email("El correo electrónico no es válido").required("El correo electrónico es requerido"),
    telefono: yup.string().required("El teléfono es requerido"),
    rol: yup.object().shape({
      nombre: yup.string().required("El tipo de rol es requerido"),
    }),
  });