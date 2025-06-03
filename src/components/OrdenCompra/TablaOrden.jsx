import { useEffect, useState } from "react";
import FacturaService from "../../services/FacturaService";
import UsuarioService from "../../services/UsuarioService";
import { Link, useNavigate } from "react-router-dom";
import { Info, AddCircle } from "@mui/icons-material";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";

export function TablaOrden() {
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await FacturaService.getfactura();
        setOrdenes(results);
        setLoaded(true);
      } catch (error) {
        setError(error.message);
        setLoaded(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    UsuarioService.getUsers()
      .then((response) => {
        if (response.data && Array.isArray(response.data.results)) {
          setUsuarios(response.data.results);
        } else {
          setError("Unexpected response structure from getUsers");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleFilter = async () => {
    try {
      let results;
      if (selectedUser && selectedDate) {
        results = await FacturaService.getFacturabyUsuariofecha(selectedUser, selectedDate);
      } else if (selectedUser) {
        results = await FacturaService.getFacturabyusuario(selectedUser);
      } else if (selectedDate) {
        // Assuming you have a getFacturabyfecha service
        results = await FacturaService.getFacturabyfecha(selectedDate);
      } else {
        results = await FacturaService.getfactura();
      }
      setOrdenes(results);
      if (results.length === 0) {
        setError("No se encontraron datos");
      } else {
        setError("");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClear = async () => {
    try {
      const results = await FacturaService.getfactura();
      setOrdenes(results);
      setSelectedUser("");
      setSelectedDate("");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error && !ordenes.length) return <p>Error: {error}</p>;

  return (
    <Container component="main" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
        Facturas
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="Usuario"
            >
              {usuarios.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Fecha"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            onClick={handleFilter}
            variant="contained"
            color="primary"
            fullWidth
          >
            Filtrar
          </Button>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            onClick={handleClear}
            variant="contained"
            color="secondary"
            fullWidth
          >
            Limpiar
          </Button>
        </Grid>
      </Grid>
      <Button
        onClick={() => navigate('/CrearFactura')}
        variant="contained"
        color="primary"
        startIcon={<AddCircle />}
        sx={{ mb: 2 }}
      >
        Crear Nueva Factura
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Acciones</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Facturar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.id}</TableCell>
                <TableCell>{factura.fecha}</TableCell>
                <TableCell>{factura.sucursal ? factura.sucursal.nombre : "Sucursal no especificada"}</TableCell>
                <TableCell>{factura.usuario ? factura.usuario.nombre : "Usuario no especificado"}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/orden/${factura.id}`}
                    variant="outlined"
                    sx={{
                      backgroundColor: "orange",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "darkorange",
                      },
                      mr: 1,
                    }}
                  >
                    Detalle <Info />
                  </Button>
                </TableCell>
                <TableCell>
                  {factura.estado === "1" ? "Factura" : "Preforma"}
                </TableCell>
                <TableCell>
                  {factura.estado === "0" && (
                    <Button
                      component={Link}
                      to={`/factura/editar/${factura.id}`}
                      variant="outlined"
                      sx={{
                        backgroundColor: "red",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "darkred",
                        },
                        mr: 1,
                      }}
                    >
                      Facturar <Info />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Container>
  );
}

