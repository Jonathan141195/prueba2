import { useEffect, useState } from "react";
import { DataTable } from "../DataTable/DataTable";
import UsuarioService from "../../services/UsuarioService";

export const MantenimientoUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const dictionaryColumns = [
   
    {
      align: "left",
      column: "nombre",
    },
    {
      align: "left",
      column: "correo_electronico",
    },
    {
      align: "left",
      column: "direccion",
    },
    {
      align: "left",
      column: "fecha_nacimiento",
    },
    {
      align: "left",
      column: "rol.nombre",
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
      id: "correo_electronico",
      numeric: false,
      disablePadding: false,
      label: "Correo Electrónico",
    },
    {
      id: "direccion",
      numeric: false,
      disablePadding: false,
      label: "Dirección",
    },
    {
      id: "fecha_nacimiento",
      numeric: false,
      disablePadding: false,
      label: "Fecha de Nacimiento",
    },
    {
      id: "rol",
      numeric: false,
      disablePadding: false,
      label: "Rol",
    },
  ];

  useEffect(() => {
    UsuarioService.getUsers()
      .then((response) => {
        console.log(response);
        setUsuarios(response.data.results);
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
      title={"Mantenimiento Usuario"}
      data={usuarios}
      headCells={headCells}
      orderByColumn={"nombre"}
      dictionaryColumns={dictionaryColumns}
      controller={"usuario"}
    ></DataTable>
  );
};

