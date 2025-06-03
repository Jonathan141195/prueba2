/* eslint-disable react/prop-types */
import { Box, FormControlLabel, Grid, Paper, Switch, TablePagination } from "@mui/material"
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableContainer } from "./DataTableContainer";

export const DataTable = (props) => {
    const { title, data, headCells, orderByColumn, dictionaryColumns, controller, children, valueStateRow, columnStateRow } = props

    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const update = () => {
        return navigate(`/${controller}/editar/${Number(selected[0]) || 0}`);
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

    return (
        <Box sx={{ marginTop: 10, textAlign: "center" }}>
            {data && data.length > 0 && (
                <Box sx={{ width: "100%" }}>
                    <Paper sx={{ width: "100%", mb: 2 }}>
                        <DataTableToolbar title={title} numSelected={selected.length} navigateUpdate={update} />

                        <DataTableContainer controller={controller} data={data} headCells={headCells} order={order} setOrder={setOrder} page={page}
                            dense={dense} rowsPerPage={rowsPerPage} selected={selected} setSelected={setSelected}
                            orderByColumn={orderByColumn} dictionaryColumns={dictionaryColumns} columnStateRow={columnStateRow} valueStateRow = {valueStateRow} />

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count} página(s)`
                            }
                        />

                    </Paper>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Relleno"
                    />
                </Box>
            )}

            <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
                {children && children}
            </Grid>

        </Box>
    )
}

DataTable.prototype = {
    title: PropTypes.string.isRequired,
    headCells: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    orderByColumn: PropTypes.string.isRequired,
    dictionaryColumns: PropTypes.array.isRequired,
    controller: PropTypes.string.isRequired,
    children: React.component
}