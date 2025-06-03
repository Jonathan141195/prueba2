import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';
import SeleccionarSucursal from '../Form/SeleccionarSucursal';
import SucursalService from '../../services/SucursalService';
import HorarioService from '../../services/HorarioService';
import VisibilityIcon from '@mui/icons-material/Visibility';
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'hora_inicio', numeric: false, disablePadding: false, label: 'Hora Inicio' },
  { id: 'hora_fin', numeric: false, disablePadding: false, label: 'Hora Fin' },
  { id: 'sucursal_nombre', numeric: false, disablePadding: false, label: 'Sucursal' },
  { id: 'estado', numeric: false, disablePadding: false, label: 'Estado' }, // Nueva columna de estado
];

function TableHorarioHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHorarioHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

function TableHorarioToolbar(props) {
  const { numSelected, idSelected, onCreateHorario } = props;
  const navigate = useNavigate();
  const update = () => {
    return navigate(`/horario/update/${idSelected}`);
  };
  const viewDetails = () => {
    navigate(`/detalleHorario/${idSelected}`);
  };


  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccionado(s)
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Mantenimiento Horarios
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Borrar">
            <IconButton>
              <DeleteIcon key={idSelected} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver Detalles">
            <IconButton onClick={viewDetails}>
              <VisibilityIcon key={idSelected} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Actualizar">
            <IconButton onClick={update}>
              <EditIcon key={idSelected} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        
        <>
          <Tooltip title="Filtrar lista">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar Horario">
            <IconButton onClick={onCreateHorario}>
              <Button variant="contained" color="primary">
                Agregar Horario
              </Button>
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}

TableHorarioToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  idSelected: PropTypes.number.isRequired,
  onCreateHorario: PropTypes.func.isRequired,
};

export default function TableHorario() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucursal, setSucursal] = useState('');
  const [dia, setDia] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('hora_inicio');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sucursales, setSucursales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    SucursalService.getSucursal()
      .then((response) => {
        if (response.data && response.data.results) {
          setSucursales(response.data.results);
        } else {
          throw new Error("Invalid response format");
        }
      })
      .catch((error) => {
        console.error("Error fetching sucursales:", error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    if (sucursal && dia) {
      console.log(`Fetching horario for sucursal: ${sucursal} and dia: ${dia}`);
      setLoading(true);
      HorarioService.getHorarioBySucursalall(dia, sucursal)
        .then((response) => {
          console.log("Response from API:", response);  // Agregar esta línea para depurar
          setData(response);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching horario:", error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      console.log("Sucursal or dia not set");
    }
  }, [sucursal, dia]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [id];
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleCreateHorario = () => {
    navigate('/Horario/Crear');
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <>
      <Grid container spacing={6} sx={{ mt: 6 }}>
        <Grid item xs={12} sm={6}>
          <SeleccionarSucursal
            field={{ value: sucursal }}
            data={sucursales}
            onChange={(e) => setSucursal(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Seleccione Fecha"
            type="date"
            variant="outlined"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ width: '100%', mb: 2, mt: 8, p: 2, borderRadius: 2, boxShadow: 3 }}>
            <TableHorarioToolbar
              numSelected={selected.length}
              idSelected={selected[0]}
              onCreateHorario={handleCreateHorario}
            />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                    <TableHorarioHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                      {stableSort(data, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const isItemSelected = isSelected(row.id);
                          const labelId = `enhanced-table-checkbox-${row.id}`;

                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, row.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                            >
                              <TableCell component="th" id={labelId} scope="row">
                                {row.hora_inicio}
                              </TableCell>
                              <TableCell>{row.hora_fin}</TableCell>
                              <TableCell>{row.sucursal_nombre}</TableCell>
                              <TableCell>
                              {row.estado === "1" ? 'Disponible' : 'Bloqueado'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </>
  );
}




    



