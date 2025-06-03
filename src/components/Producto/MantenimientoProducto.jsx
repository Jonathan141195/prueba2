import { useEffect, useState } from "react";
import ProductoService from "../../services/ProductoService";
import { DataTable } from "../DataTable/DataTable";

export const MantenimientoProducto = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const dictionaryColumns = [
        {
            align: 'left',
            column: 'nombre'
        },
        {
            align: 'left',
            column: 'descripcion'
        },
        {
            align: 'left',
            column: 'marca'
        },
        {
            align: 'left',
            column: 'precio'
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
            id: "descripcion",
            numeric: false,
            disablePadding: false,
            label: "Descripción",
        },
        {
            id: "marca",
            numeric: false,
            disablePadding: false,
            label: "Marca",
        },
        {
            id: "precio",
            numeric: false,
            disablePadding: false,
            label: "Precio",
        },
    ];

    useEffect(() => {
        ProductoService.getProductos()
            .then((response) => {
                console.log(response);
                setProductos(response.data.results)
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
        <DataTable title={"Mantenimiento Productos"} data={productos} headCells={headCells} orderByColumn={"year"} dictionaryColumns={dictionaryColumns} controller={"producto"} />
    )
}