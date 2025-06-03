import { useEffect, useState } from "react";
import { DataTable } from "../DataTable/DataTable";


export const MantenimientoBodega = () => {
  const [bodegas, setBodegas] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const dictionaryColumns = [
    {
      align: "left",
      column: "nombre",
    },
    {
      align: "left",
      column: "dimensiones",
    },
    {
      align: "left",
      column: "capacidad",
    },
    {
      align: "left",
      column: "vencimiento",
    },

    {
      align: "left",
      column: "telefono",
    },
    {
      align: "left",
      column: "provincia.nombre",
    },

    {
      align: "left",
      column: "canton.nombre",
    },
    {
      align: "left",
      column: "distrito.nombre",
    },
    {
      align: "left",
      column: "direccion",
    },
  ];

  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "nombre",
      numeric: false,
      disablePadding: false,
      label: "Nombre",
    },
    {
      id: "dimensiones",
      numeric: false,
      disablePadding: false,
      label: "Dimensiones",
    },
    {
      id: "capacidad",
      numeric: false,
      disablePadding: false,
      label: "Capacidad",
    },
    {
      id: "vencimiento",
      numeric: false,
      disablePadding: false,
      label: "Vencimiento",
    },
    {
      id: "telefono",
      numeric: false,
      disablePadding: false,
      label: "Teléfono",
    },
    {
      id: "provinciaId",
      numeric: false,
      disablePadding: false,
      label: "Provincia",
    },

    {
      id: "cantonId",
      numeric: false,
      disablePadding: false,
      label: "Cantón",
    },
    {
      id: "distritoId",
      numeric: false,
      disablePadding: false,
      label: "Distrito",
    },
    {
      id: "direccion",
      numeric: false,
      disablePadding: false,
      label: "Dirección",
    },
  ];

  useEffect(() => {
    BodegaService.getBodegas()
      .then((response) => {
        console.log(response);
        setBodegas(response.data.results);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          setError(error);
          console.log(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <DataTable
      title={"Mantenimiento Bodegas"}
      data={bodegas}
      headCells={headCells}
      orderByColumn={"year"}
      dictionaryColumns={dictionaryColumns}
      controller={"bodega"}
    ></DataTable>
  );
};
