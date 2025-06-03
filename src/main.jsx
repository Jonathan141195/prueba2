// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./components/Home/Home.jsx";
import { PageNotFound } from "./components/Home/PageNotFound.jsx";
import { ListaProductos } from "./components/Producto/ListaProductos.jsx";

import { DetalleProducto } from "./components/Producto/DetalleProducto.jsx";
import { TablaOrden } from "./components/OrdenCompra/TablaOrden.jsx";
import  DetalleOrden from "./components/OrdenCompra/DetalleOrden.jsx";
import Agenda from "./components/Reserva/Agenda.jsx"; // Asegúrate de que la ruta sea correcta
import { CreateServicio } from "./components/Servicio/CreateServicio.jsx";
import { CreateProducto } from "./components/Producto/CreateProducto.jsx";
import { CreateSucursal } from "./components/Sucursal/CreateSucursal.jsx";
import { CrearFactura } from "./components/OrdenCompra/CrearFactura.jsx";
import { CrearProveedor } from "./components/Proveedor/CrearProveedor.jsx";
import { CrearUsuario } from "./components/Usuario/CrearUsuario.jsx";
import { EditarProveedor } from "./components/Proveedor/EditarProveedor.jsx";
import { MantenimientoProveedor } from "./components/Proveedor/MantenimientoProveedor.jsx";
import  TableProducto  from "./components/Producto/TableProductos.jsx";
import { ListaServicios } from "./components/Servicio/ListaServicios.jsx";
import { DetalleProveedor } from "./components/Proveedor/DetalleProveedor.jsx";
import { DetalleSucursal } from "./components/Sucursal/DetalleSucursal.jsx";
import { MantenimientoUsuario } from "./components/Usuario/MantenimientoUsuario.jsx";
import {EditarUsuario } from "./components/Usuario/EditarUsuario.jsx";
import { ListaUsuarios } from "./components/Usuario/ListaUsuarios.jsx";
import { DetalleReserva } from "./components/Reserva/DetalleReserva.jsx";
import { DetalleServicio } from "./components/Servicio/DetalleServicio.jsx";
import  ListaUsuariosReserva  from "./components/Reserva/ListaUsuariosReserva.jsx";
import { ListaSucursal } from "./components/Sucursal/ListaSucursal.jsx";
import { UpdateProducto } from "./components/Producto/UpdateProducto.jsx";
import  TablaServicio  from "./components/Servicio/TablaServicio.jsx";
import  TableSucursal  from "./components/Sucursal/TableSucursal.jsx";
import  TablaHorario  from "./components/Horario/TablaHorario.jsx";
import  { UpdateServicio } from "./components/Servicio/UpdateServicio.jsx";
import  { UpdateHorario } from "./components/Horario/UpdateHorario.jsx";
import { UpdateSucursal } from "./components/Sucursal/UpdateSucursal.jsx";
import {  CrearReserva }  from "./components/Reserva/CrearReserva.jsx";
import {CrearHorario } from "./components/Horario/CrearHorario.jsx";
import { DetalleHorario } from "./components/Horario/DetalleHorario.jsx";
import { UpdateFactura } from "./components/OrdenCompra/UpdateFactura.jsx";
import { UpdateReserva } from "./components/Reserva/UpdateReserva.jsx";
import { CancelarReserva } from "./components/Reserva/CancelarReserva.jsx";
import { ConfirmarReserva } from "./components/Reserva/ConfirmarReserva.jsx";
import { Auth } from "./components/User/Auth.jsx";
import { Login } from "./components/User/Login.jsx";
import { Signup } from "./components/User/Signup.jsx";
import UserProvider from "./components/User/UserProvider.jsx";
import { Unauthorized } from "./components/User/Unauthorized.jsx";
import { Logout } from "./components/User/Logout.jsx";
import { ReporteCitasSucursal } from "./components/Graficos/ReporteCitasSucursal.jsx";
import { ReporteTopServicios } from "./components/Graficos/ReporteTopServicios.jsx";
import { ReporteTopProductos } from "./components/Graficos/ReporteTopProductos.jsx";
import { ReporteCitasEstado } from "./components/Graficos/ReporteCitasEstado.jsx";


// import { GraficoUnoMuchos } from "./components/OrdenCompra/GraficoUnoMuchos.jsx";

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        path: "/",
        element: <Auth allowedRoles={['Administrador', 'Encargado']} />,
        children: [
      {
        path: "/mantenimientoProveedor",
        element: <MantenimientoProveedor />,
      },
      {
        path: "/mantenimientoServicios",
        element: <TablaServicio />,
      },
      {
        path: "/CitasxSucursal",
        element: <ReporteCitasSucursal/>,
      },
      {
        path: "/TopServicios",
        element: <ReporteTopServicios/>,
      },
      {
        path: "/TopProductos",
        element: <ReporteTopProductos/>,
      },
      {
        path: "/reservarxestado",
        element: <ReporteCitasEstado/>,
      },
      
      
      {
        path: "proveedor/crear/",
        element: <CrearProveedor />,
      },
      {
        path: "proveedor/editar/:id",
        element: <EditarProveedor />,
      },
      
      {
        path: "/proveedor/:id",
        element: <DetalleProveedor />,
      },
   
      {
        path: "/mantenimientoSucursal",
        element: <TableSucursal />,
      },
      
      {
        path: "/servicio/crear",
        element: <CreateServicio />,
      },
      {
        path: "/servicio/update/:id",
        element: <UpdateServicio />,
      },
      {
        path: "/Horario/update/:id",
        element: <UpdateHorario />,
      },
      
      {
        path: "/mantenimientoProducto",
        element: <TableProducto />,
      },
      {
        path: "producto/crear/",
        element: <CreateProducto />,
      },
      
      {
        path: "/producto/update/:id",
        element: <UpdateProducto />,
      },
      {
        path: "/sucursal/update/:id",
        element: <UpdateSucursal />,
      },
      
      
      {
        path: "/Sucursal/:id",
        element: <DetalleSucursal />,
      },
      {
        path: "/orden",
        element: <TablaOrden />,
      },
      {
        path: "/orden/:id",
        element: <DetalleOrden />,
      },
      
     
      {
        path: "/CrearFactura",
        element: <CrearFactura />,
      },
      
      {
        path: "/factura/editar/:id",
        element: <UpdateFactura />,
      },
        
      
      {
        path: "mantenimientoUsuario",
        element: <MantenimientoUsuario />,
      },
      
      {
        path: "usuarioLista",
        element: <ListaUsuarios />,
      },
      {
        path: "/ListaUsuario",
        element: <ListaUsuariosReserva />,
      },
      {
        path: "/Sucursal/crear",
        element: <CreateSucursal />,
      },
      {
        path: "/mantenimientoHorario",
        element: <TablaHorario />,
      },
      {
        path: "/Horario/Crear",
        element: <CrearHorario />,
      },
      
    ],
    
  },
 
 //usuario
 {
  path: "/user/login",
  element: <Login />,
},
{
  path: "Reserva/Detalle/:id",
  element: <DetalleReserva  />,
},
{
  path: "/listaReservas",
  element: <Agenda />,
},
{
  path: "/Reserva/crear",
  element: <CrearReserva />,
},
{
  path: "/listaProducto",
  element: <ListaProductos />,
},
{
  path: "/producto/:id",
  element: <DetalleProducto />,
},
{
  path: "/usuario/Crear",
  element: <CrearUsuario />,
},

{
  path: "/servicio/:id",
  element: <DetalleServicio />,
},
{
  path: "/detalleHorario/:id",
  element: <DetalleHorario />,
},
{
  path: "/ListaAgenda",
  element: <Agenda />,
},
{
  path: "/listaSucursales",
  element: <ListaSucursal />,
},
{
  path: "/Reserva/editar/:id",
  element: <UpdateReserva />,
},
{
  path: "/Reserva/cancel/:id",
  element: <CancelarReserva />,
},

{
  path: "usuario/editar/:id",
  element: <EditarUsuario />,
},
{
  path: "Reserva/confirmar/:id",
  element: <ConfirmarReserva  />,
},
{
  path: "/ReservabyUsuario/:id",
  element: <Agenda />,
},
{
  path: "/Sucursal",
   element: <ListaSucursal />,
},
{
  path: "/listaServicios",
  element: <ListaServicios />,
},
{
  path: "/user/create",
  element: <Signup />,
},

{
  path: "/user/logout",
  element: <Logout />,
},

{
  path: "mantenimientoUsuario",
  element: <MantenimientoUsuario />,
},


{
  path: "usuarioLista",
  element: <ListaUsuarios/>,
},
//User

{
  path: '/unauthorized',
  element: <Unauthorized />,
},
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </React.StrictMode>
);
