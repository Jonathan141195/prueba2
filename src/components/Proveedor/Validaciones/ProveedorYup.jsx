import * as yup from "yup";
export const apiFerre = yup.object({
  id: yup.number(),
  nombre: yup
    .string()
    .required("El nombre es requerido.")
    .min(2, "El nombre debe de tener 2 caracteres"),
  telefono: yup
    .number()
    .typeError("Solo acepta números")
    .required("El costo es requerido")
    .positive("Solo acepta números positivos"),
  correo: yup
    .string()
    .required("El correo es requerido.")
    .email("El correo electrónico no es válido.")
    .test("email-domain", "El correo debe ser de Gmail o Hotmail", (value) => {
      if (!value) return true; // Si el valor está vacío, no se aplica la validación de dominio
      return (
        value.endsWith("@gmail.com") ||
        value.endsWith("@hotmail.com") ||
        value.endsWith("@outlook.com") // Puedes agregar otros dominios según tus necesidades
      );
    })
    .min(2, "El correo debe tener al menos 2 caracteres."),
  direccion: yup
    .string()
    .required("La dirección es requerido.")
    .min(2, "La dirección debe de tener 2 caracteres"),
  provincia: yup
    .number()
    .required("Provincia requerida")
    .positive("Provincia requerida"),
  canton: yup
    .number()
    .required("Cantón requerida")
    .positive("Cantón requerida"),
  distrito: yup
    .number()
    .required("Distrito requerido")
    .positive("Distrito requerido"),
  listaContactos: yup.array().of(
    yup.object().shape({
      nombre: yup
        .string()
        .required("El nombre del contacto es requerido.")
        .min(2, "El nombre debe de tener 2 caracteres"),
      telefono: yup
        .number()
        .typeError("Solo acepta números")
        .required("El costo es requerido")
        .positive("Solo acepta números positivos"),
    })
  ),
});
