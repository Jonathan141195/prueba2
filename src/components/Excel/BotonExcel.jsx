import  { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const BotonExcel = ({ productos }) => {
  const [loading, setLoading] = useState(false);
  const titulo = [{ A: "Reporte de Productos" }, {}];

  const informacionAdicional = {
    A: "Creado por Taller Alvarez",
  };

  const longitudes = [5, 35, 25, 20, 10];
  const handDownload = () => {
    setLoading(true);
    let tabla = [
      {
        A: "ID",
        B: "Nombre",
        C: "Descripción",
        D: "marca",
        E: "precio",
      },
    ];

    try {
      productos.forEach((producto) => {
        tabla.push({
          A: producto.id,
          B: producto.nombre,
          C: producto.descripcion,
          D: producto.marca,
          E: producto.precio,
        });
      });

      const dataFinal = [...titulo, ...tabla,{}, informacionAdicional];
      setTimeout(() => {
        creandoArchivo(dataFinal);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error al crear el archivo Excel:", error);
      setLoading(false); // Asegurar que el estado loading se actualice en caso de error
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
    XLSX.utils.book_append_sheet(libro, hoja, "Productos");
    XLSX.writeFile(libro, "ProductoExcel.xlsx");
  };

  return (
    <>
    {loading ? (
      <Button
        color="success"
        disabled
        sx={{ backgroundColor: "#4CAF50", fontWeight: "bold", fontSize: "1.2rem" }}
      >
        Cargando ...
      </Button>
    ) : (
      <Button
        color="success"
        onClick={handDownload}
        className="mt-3"
        sx={{ backgroundColor: "green", fontWeight: "bold", color: "white", fontSize: "1.2rem" }}
      >
        Exportar Lista Productos a Excel
      </Button>
    )}
  </>
  );
};

BotonExcel.propTypes = {
  productos: PropTypes.array.isRequired,
};

export default BotonExcel;


