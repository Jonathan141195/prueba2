/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useState } from "react";
import { DataTableHead } from "./DataTableHead";
import { stableSort, getComparator } from "../utils/utils";
import { Checkbox, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { isNil } from "lodash";

export const DataTableContainer = (props) => {
  const { controller, data, headCells, orderByColumn, dictionaryColumns } =
    props;
  const {
    order,
    setOrder,
    page,
    dense,
    rowsPerPage,
    selected,
    setSelected,
    columnStateRow,
    valueStateRow,
  } = props;



  const [orderBy, setOrderBy] = useState(orderByColumn);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    let newSelected = [name];
    const selectedIndex = selected.indexOf(name);

    if (selectedIndex === 0) {
      newSelected = [];
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Table
      sx={{ minWidth: 750 }}
      aria-labelledby="tableTitle"
      size={dense ? "small" : "medium"}
    >
      <DataTableHead
        order="asc"
        orderBy={orderBy}
        controller={controller}
        headCells={headCells}
        onRequestSort={handleRequestSort}
      />

      <TableBody>
        {stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            const isItemSelected = isSelected(row.id);
            const labelId = `enhanced-table-checkbox-${index}`;

            const backgroundColor =
            !isNil(row[columnStateRow]) &&
            row[columnStateRow] == valueStateRow
              ? "red"
              : "#121212";
           


            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                selected={isItemSelected}
                sx={{ cursor: "pointer", backgroundColor: backgroundColor }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </TableCell>
                {row.id && (
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="data"
                    padding="none"
                  >
                    {row.id}
                  </TableCell>
                )}

                {dictionaryColumns.map((element, index) => {
                  const columnChild = element.column.split(".");
                  return (
                    <TableCell key={index} align={element.align}>
                      {columnChild.length == 1
                        ? row[columnChild[0]]
                        : row[columnChild[0]][columnChild[1]]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        {emptyRows > 0 && (
          <TableRow
            style={{
              height: (dense ? 33 : 53) * emptyRows,
            }}
          >
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

DataTableContainer.prototype = {
  controller: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  headCells: PropTypes.array.isRequired,
  order: PropTypes.string.isRequired,
  setOrder: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  dense: PropTypes.bool.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.array.isRequired,
  orderByColumn: PropTypes.string.isRequired,
  dictionaryColumns: PropTypes.array.isRequired,
};
