import * as yup from "yup";

export const apiFerre = yup.object({
  id: yup.number(),
  bodegaId: yup.number().min(1, "La bodega es requerida").required("La bodega es requerida."),
  productoId: yup.number().min(1, "El producto es requerido").required("El producto es requerido."),
  totalDisponible: yup.number("Total disponible debe ser un valor númerico").min(0, "La cantidad minima asignable es 0").required("Total disponible es requerido."),
  cantidadMinima: yup
    .number().typeError("La cantidad mínima es requerida")
    .required("La cantidad mínima es requerida.")
    .min(0, "La cantidad minima asignable es 0")
    .test({
      name: "minima-mayor-que-maxima",
      exclusive: true,
      message: "La cantidad mínima debe ser menor que la máxima",
      test: function (value) {
        const cantidadMaxima = this.parent.cantidadMaxima;
        return value < cantidadMaxima;
      },
    }),
  cantidadMaxima: yup
    .number().typeError("La cantidad máxima es requerida")
    .required("La cantidad máxima es requerida.")
    .min(1, "La cantidad minima asignable es 1")
    .test({
      name: "maxima-menor-que-minima",
      exclusive: true,
      message: "La cantidad máxima debe ser mayor que la mínima",
      test: function (value) {
        const cantidadMinima = this.parent.cantidadMinima;
        return value > cantidadMinima;
      },
    }),
});
