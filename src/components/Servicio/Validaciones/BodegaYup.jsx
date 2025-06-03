import * as yup from "yup";

export const apiFerre = yup.object({
  nombre: yup
    .string()
    .required("El nombre es requerido.")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  dimensiones: yup.string().required("Las dimensiones son requeridas."),
  capacidad: yup.string().required("La capacidad es requerida."),
  vencimiento: yup
    .date()
    .nullable()
    .required("La fecha de vencimiento es requerida."),
  telefono: yup
    .number()
    .typeError("Solo acepta números")
    .required("El teléfono es requerido")
    .positive("El teléfono debe ser un número positivo"),
  provinciaId: yup
    .number()
    .required("La provincia es requerido")
    .positive(""),
    cantonId: yup
    .number()
    .required("El cantón es requerido")
    .positive(""),
  distritoId: yup
    .number()
    .required("El ID del distrito es requerido")
    .positive(""),
  direccion: yup
    .string()
    .required("La dirección es requerida.")
    .min(2, "La dirección debe tener al menos 2 caracteres"),
});
