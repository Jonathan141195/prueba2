import * as yup from "yup";

export const yupProducto = yup.object({
    //**Procedemos a realizar las validaciones, trabajando con relaciones de uno a muchos */
    id: yup
      .number()
      .required("Id requerido"),
    nombre: yup
      .string()
      .required("El nombre requerido."),
    descripcion: yup
      .string()
      .required("La descripciómn es requerida.")
      .min(2, "La descripción debe de tener 2 caracteres"),
    costo: yup
      .number().typeError("El costo es requerido")
      .typeError("Solo acepta números")
      .required("El costo es requerido")
      .positive("Solo acepta números positivos"),
    // cantidad: yup
    //   .number()
    //   .typeError("Solo acepta números")
    //   .required("La cantidad es requerida")
    //   .positive("Solo acepta números positivos"),
    sku: yup
      .string()
      .required("El SKU es requerido"),
    Categoria: yup
      .number()
      .typeError("Seleccione una subcategoria")
      .required("La subcategoria es requerido"),
    marca: yup
      .string()
      .required("La marca es requerido.")
      .min(2, "La marca debe de tener 2 caracteres"),
  modelo: yup
      .number()
      .required("El modelo es requerido."),
      precio: yup
      .number()
      .required("El modelo es requerido.")
      
      
  });