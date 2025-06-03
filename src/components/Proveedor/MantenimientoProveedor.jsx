import { useEffect, useState } from "react";
import { DataTable } from "../DataTable/DataTable";
import ProveedorService from "../../services/ProveedorService";
import BotonExcelProveedorContacto from "../Excel/BotonExcelProveedorContacto";
import ContactoService from "../../services/ContactoService";

export const MantenimientoProveedor = () => {
    const [contactos, setContactos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const dictionaryColumns = [
        {
            align: 'left',
            column: 'nombre'
        },
        {
            align: 'left',
            column: 'telefono'
        },
        {
            align: 'left',
            column: 'correo'
        },
        {
            align: 'left',
            column: 'direccion'
        }]

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
            id: "telefono",
            numeric: false,
            disablePadding: false,
            label: "Teléfono",
        },
        {
            id: "correo",
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
    ];

    useEffect(() => {
        ProveedorService.getProveedores()
            .then((response) => {
                console.log(response);
                setProveedores(response.data.results);
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

        ContactoService.getContactos()
            .then((response) => {
                console.log(response);
                setContactos(response.data.results);
            })
            .catch((error) => {
                console.error("Error al obtener la lista de contactos:", error);
            });
    }, []);

    if (!loaded) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <DataTable title={"Mantenimiento Proveedores"} data={proveedores} headCells={headCells} orderByColumn={"year"} dictionaryColumns={dictionaryColumns} controller={"proveedor"}>
            <BotonExcelProveedorContacto
                contactos={contactos}
                proveedores={proveedores}
                variant="contained"
                color="primary"
                sx={{ fontSize: "1.2rem" }}
            >
                Exportar Lista Proveedores - Contactos a Excel
            </BotonExcelProveedorContacto>
        </DataTable>
    )
}