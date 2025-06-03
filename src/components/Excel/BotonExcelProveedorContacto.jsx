/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const BotonExcelOCProducto = ({ contactos, proveedores, children }) => {
  const [loading, setLoading] = useState(false);
  const titulo = [{ A: "Reporte de Proveedores - Contactos" }, {}];

  const informacionAdicional = {
    A: "Creado por FerreControl",
  };

  const longitudes = [5, 35, 25, 20, 35];
  const handDownload = () => {
    setLoading(true);
    let tabla = [
      {
        A: "ID",
        B: "Nombre Contacto",
        C: "Contacto Teléfono",
        D: "Nombre Proveedor",
        E: "Proveedor Teléfono",
      },
    ];

    try {
      contactos.forEach((contacto) => {
        const proveedor = proveedores.find((prov) => prov.id === contacto.proveedorId);
        tabla.push({
          A: contacto.id,
          B: contacto.nombre,
          C: contacto.telefono,
          D: proveedor ? proveedor.nombre : "Proveedor no encontrado",
          E: proveedor ? proveedor.telefono : "Proveedor no encontrado",  // Si no se encuentra el proveedor, se muestra un mensaje
        });
      });

      const dataFinal = [...titulo, ...tabla, {}, informacionAdicional];
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
    XLSX.utils.book_append_sheet(libro, hoja, "Proveedor");
    XLSX.writeFile(libro, "ProveedorExcel.xlsx");
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
          {children}
        </Button>
      )}
    </>
  );
};

BotonExcelOCProducto.propTypes = {
  contactos: PropTypes.array.isRequired,
  proveedores: PropTypes.array.isRequired,
};

export default BotonExcelOCProducto;


