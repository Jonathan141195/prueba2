import { useState, useEffect,useContext  } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { UserContext } from '../../context/UserContext'; // Importa el contexto

import { MenuList } from "@mui/material";

export default function Header() {
  //informacion del usuario
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);


  

  const [loaded, setLoaded] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElUsuario, setAnchorElUsuario] = useState(null);
  const [anchorElProduct, setAnchorElProduct] = useState(null);
  const [anchorElBodega, setAnchorElBodega] = useState(null);
  const [anchorInventario, setAnchorInventario] = useState(null);
  // const [anchorElTraslado, setAnchorElTraslado] = useState(null);
  const [anchorElProveedor, setanchorElProveedor] = useState(null);
  const [anchorOrden, setanchorOrden] = useState(null);
 

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorSalidaInventario, setanchorSalidaInventario] = useState(null);
  

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000); // Cambia este valor según el tiempo de retardo deseado
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenUserMenu2 = (event) => {
    setAnchorElUsuario(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProductMenuOpen = (event) => {
    setAnchorElProduct(event.currentTarget);
  };

  const handleInventarioMenuOpen = (event) => {
    setAnchorInventario(event.currentTarget);
  };

  const handleBodegaMenuOpen = (event) => {
    setAnchorElBodega(event.currentTarget);
  };
  // const handleTrasladoMenuOpen = (event) => {
  //   setAnchorElTraslado(event.currentTarget);
  // };

  const handleProveedorMenuOpen = (event) => {
    setanchorElProveedor(event.currentTarget);
  };

  const handleOrdenMenuOpen = (event) => {
    setanchorOrden(event.currentTarget);
  };

  const handleSalidaInventarioMenuOpen = (event) => {
    setanchorSalidaInventario(event.currentTarget);
  };

  const handleCloseMenus = () => {
    setAnchorElProduct(null);
    setAnchorElBodega(null);
    // setAnchorElTraslado(null);
    setanchorElProveedor(null);
    setanchorOrden(null);
    setMobileMenuOpen(false);
    setAnchorInventario(null);
    setanchorSalidaInventario(null);
    setAnchorElUser(null);
    setAnchorElUsuario(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ opacity: loaded ? 1 : 0, transition: "opacity 1s ease" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: "inline-block", sm: "none" } }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{ color: "black" }}
            >
              Taller Alvarez
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", sm: "inline-block" } }}>
            {/* Botón y menú de Productos */}
            <Box sx={{ display: "inline-block", margin: 1 }}>
              <Button
                variant="outlined"
                onClick={handleProductMenuOpen}
                aria-controls="productos-menu"
                aria-haspopup="true"
              >
                <Typography textAlign="center" style={{ color: "black" }}>
                  Productos
                </Typography>
              </Button>
              <Menu
                id="productos-menu"
                anchorEl={anchorElProduct}
                open={Boolean(anchorElProduct)}
                onClose={handleCloseMenus}
              >
                <MenuItem component={Link} to="/listaProducto">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Lista Productos
                  </Typography>
                </MenuItem>
                {user && autorize({ allowedRoles: ["Administrador", "Encargado"] }) && (
                <MenuItem component={Link} to="/mantenimientoProducto">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Mantenimiento Productos
                  </Typography>
                </MenuItem>
                
                 )}
                 <MenuItem component={Link} to="/TopProductos">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Gráfico Top Productos
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            {/* Botón y menú de Productos */}

            {/* Botón y menú de Bodega */}
            <Box sx={{ display: "inline-block", margin: 1 }}>
              <Button
                variant="outlined"
                onClick={handleBodegaMenuOpen}
                aria-controls="bodegas-menu"
                aria-haspopup="true"
              >
                <Typography textAlign="center" style={{ color: "black" }}>
                  Sucursales
                </Typography>
              </Button>
              <Menu
                id="bodegas-menu"
                anchorEl={anchorElBodega}
                open={Boolean(anchorElBodega)}
                onClose={handleCloseMenus}
              >
                <MenuItem component={Link} to="/Sucursal">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Lista Sucursales
                  </Typography>
                </MenuItem>
                {user && autorize({ allowedRoles: ["Administrador", "Encargado"] }) && (
                <MenuItem component={Link} to="/mantenimientoSucursal">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Mantenimiento Sucursales
                  </Typography>
                  </MenuItem>
                   )}
                  <MenuItem component={Link} to="/CitasxSucursal">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Gráfico Citas Por Sucursal
                  </Typography>
                </MenuItem>

                
              </Menu>
            </Box>
            {/* fin Botón y menú de bodegas */}
            {/* Botón y menú de inventario */}
            <Box sx={{ display: "inline-block", margin: 1 }}>
              <Button
                variant="outlined"
                onClick={handleInventarioMenuOpen}
                aria-controls="inventario-menu"
                aria-haspopup="true"
              >
                <Typography textAlign="center" style={{ color: "black" }}>
                  Reservas
                </Typography>
              </Button>
              <Menu
                id="inventario-menu"
                anchorEl={anchorInventario}
                open={Boolean(anchorInventario)}
                onClose={handleCloseMenus}
              >
                <MenuItem component={Link} to="/ListaReservas">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Lista Reservas
                  </Typography>
                </MenuItem>
                {user && autorize({ allowedRoles: ["Administrador", "Encargado"] }) && (
                <MenuItem component={Link} to="/reservarxestado">
                  <Typography textAlign="center" style={{ color: "white" }}>
                  Gráfico Reservas por Estado
                  </Typography>
                </MenuItem>
                 )}
              </Menu>
            </Box>
            
            <Box sx={{ display: "inline-block", margin: 1 }}>
              <Button
                variant="outlined"
                onClick={handleProveedorMenuOpen}
                aria-controls="proveedor-menu"
                aria-haspopup="true"
              >
                <Typography textAlign="center" style={{ color: "black" }}>
                  Servicios
                </Typography>
              </Button>
              <Menu
                id="proveedor-menu"
                anchorEl={anchorElProveedor}
                open={Boolean(anchorElProveedor)}
                onClose={handleCloseMenus}
              >
                <MenuItem component={Link} to="/listaServicios">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Lista Servicios
                  </Typography>
                </MenuItem>
                {user && autorize({ allowedRoles: ["Administrador", "Encargado"] }) && (
                <MenuItem component={Link} to="/mantenimientoServicios">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Mantenimiento Servicios
                  </Typography>
                </MenuItem>
                 )}
                 <MenuItem component={Link} to="/TopServicios">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Gráfico Top Servicios
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            {/* fin Botón y menú de Proveedores */}

            {/* Botón y menú de OC */}
            <Box sx={{ display: "inline-block", margin: 1 }}>
              <Button
                variant="outlined"
                onClick={handleOrdenMenuOpen}
                aria-controls="orden-menu"
                aria-haspopup="true"
              >
                <Typography textAlign="center" style={{ color: "black" }}>
                  Factura
                </Typography>
              </Button>
              <Menu
                id="orden-menu"
                anchorEl={anchorOrden}
                open={Boolean(anchorOrden)}
                onClose={handleCloseMenus}
              >
                <MenuItem component={Link} to="/orden">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Lista de Facturas
                  </Typography>
                </MenuItem>
                
              </Menu>
            </Box>
            {/* fin Botón y menú de ordenes de compra */}

            {/* Botón y menú salida de órdenes */}
            <Box sx={{ display: "inline-block", margin: 1 }}>
              <Button
                variant="outlined"
                onClick={handleSalidaInventarioMenuOpen}
                aria-controls="salida-menu"
                aria-haspopup="true"
              >
                <Typography textAlign="center" style={{ color: "black" }}>
                  Horarios
                </Typography>
              </Button>
              <Menu
                id="salidaInventario-menu"
                anchorEl={anchorSalidaInventario}
                open={Boolean(anchorSalidaInventario)}
                onClose={handleCloseMenus}
              >
                 {user && autorize({ allowedRoles: ["Administrador", "Encargado"] }) && (
                <MenuItem component={Link} to="/mantenimientoHorario">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Mantenimiento Horarios
                  </Typography>
                </MenuItem>
              )}
              </Menu>
            </Box>
            {/* fin Botón y menú de salida órdenes de compra */}

            {/* Botón y menú de Usuarios */}
            <Box sx={{ display: "inline-block", margin: 1 }}>
              <Button
                variant="outlined"
                onClick={handleOpenUserMenu2}
                aria-controls="usuario-menu"
                aria-haspopup="true"
              >
                <Typography textAlign="center" style={{ color: "black" }}>
                  Usuarios
                </Typography>
              </Button>
              <Menu
                id="usuario-menu"
                anchorEl={anchorElUsuario}
                open={Boolean(anchorElUsuario)}
                onClose={handleCloseMenus}
              >
                <MenuItem component={Link} to="/usuarioLista">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Lista Usuarios
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} to="/mantenimientoUsuario">
                  <Typography textAlign="center" style={{ color: "white" }}>
                    Mantenimiento Usuario
                  </Typography>
                </MenuItem>
              
              </Menu>
            </Box>
            {/* fin Botón y menú de usuario */}
          </Box>

          {/* Menú Usuarios */}
          <Box>
            {/* fin Botón principal  */}
            <Tooltip title="Usuario">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <PersonIcon style={{ fill: "white" }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!userData && (
                <MenuList>
                  <MenuItem component="a" href="/user/login">
                    <Typography textAlign="center" style={{ color: "white" }}>
                      Inicio
                    </Typography>
                  </MenuItem>

                  <MenuItem component="a" href="/user/create">
                    <Typography textAlign="center" style={{ color: "white" }}>
                      Registrarse
                    </Typography>
                  </MenuItem>
                </MenuList>
               )}

        {userData && (
                <MenuList>
                  <MenuItem>
                    <Typography variant="subtitle1" gutterBottom>
                    <Typography variant="subtitle1" gutterBottom>
                      {userData?.correo_electronico}
                    </Typography>
                    </Typography>
                  </MenuItem>
                  <MenuItem color="secondary" component="a" href="/user/logout">
                  <Typography textAlign="center">Salir</Typography>
                </MenuItem>
                </MenuList>
               )}
            </Menu>
          </Box>
          {/* fin Menú Usuarios */}
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={document.body}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {/* Opciones del menú móvil */}
        <MenuItem component={Link} to="/producto">
          <Typography textAlign="center" style={{ color: "white" }}>
            Productos
          </Typography>
        </MenuItem>
        <MenuItem component={Link} to="/bodega">
          <Typography textAlign="center" style={{ color: "white" }}>
            Sucursal
          </Typography>
        </MenuItem>
        <MenuItem component={Link} to="/Traslados">
          <Typography textAlign="center" style={{ color: "white" }}>
            Traslados
          </Typography>
        </MenuItem>
        <MenuItem component={Link} to="/Proveedores">
          <Typography textAlign="center" style={{ color: "white" }}>
            Proveedores
          </Typography>
        </MenuItem>
        <MenuItem component={Link} to="/Usuarios">
          <Typography textAlign="center" style={{ color: "white" }}>
            Usuarios
          </Typography>
        </MenuItem>
        {/* Agrega aquí más opciones según sea necesario */}
      </Menu>
      {/* Fin Mobile Menu */}
    </Box>
  );
}
