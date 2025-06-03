import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const BotonExcelOCProducto = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const titulo = [{ A: "Reporte Órdenes y Productos" }, {}];

  const informacionAdicional = {
    A: "Creado por FerreControl",
  };
  const longitudes = [20, 35, 25, 20, 35, 35, 35];


 const handDownload = () => {
  setLoading(true);
  
  // Verificar si data es undefined o null
  if (!data) {
    console.error("La propiedad 'data' no está definida.");
    setLoading(false);
    return;
  }

  let tabla = [
    {
      A: "ID Orden Compra",
      B: "Fecha Creación",
      C: "Fecha Recibida",
      D: "Bodega",
      E: "Proveedor",
      F: "Nombre Producto",
      G: "Cantidad",
    },
  ];

  const datos = {
    A: data.id,
    B: data.fechaOrden,
    C: data.fechaRecibida,
    D: data.bodega.nombre,
    E: data.proveedor.nombre,

  };

  tabla.push(datos);


  try { 
    console.log(data.detalle)

  
    data.detalle.forEach((r) => {

      tabla.push({
        F: r.nombre,
        G: r.cantidad ,  // Si no se encuentra el proveedor, se muestra un mensaje
      });
    });

    const dataFinal = [...titulo, ...tabla, {}, informacionAdicional];
    setTimeout(() => {
      creandoArchivo(dataFinal);
      setLoading(false);
    }, 1000);
  } catch (error) {
    console.error("Error al crear el archivo Excel:", error);
    setLoading(false); 
  }
};


  const creandoArchivo = (dataFinal) => {
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(dataFinal, { skipHeader: true });

    hoja["!merges"] = [
      XLSX.utils.decode_range("A1:G1"),
      XLSX.utils.decode_range("A2:G2"),
      XLSX.utils.decode_range("A34:G34"),
    ];

    let propiedades = [];

    longitudes.forEach((col) => {
      propiedades.push({
        width: col,
      });
    });
    hoja["!cols"] = propiedades;
    XLSX.utils.book_append_sheet(libro, hoja, "OrdenProducto");
    XLSX.writeFile(libro, "OrdenesProdcutosExcel.xlsx");
  };

  return (
    <>
      {loading ? (
        <Button
          color="success"
          disabled
          sx={{
            backgroundColor: "#4CAF50",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          Cargando ...
        </Button>
      ) : (
        <Button
          color="success"
          onClick={handDownload}
          className="mt-3"
          sx={{
            backgroundColor: "green",
            fontWeight: "bold",
            color: "white",
            fontSize: "1.2rem",
          }}
        >
          Exportar Lista Órdenes de Compra - Productos a Excel
        </Button>
      )}
    </>
  );
};

BotonExcelOCProducto.propTypes = {
  data: PropTypes.object.isRequired,

};


export default BotonExcelOCProducto;

