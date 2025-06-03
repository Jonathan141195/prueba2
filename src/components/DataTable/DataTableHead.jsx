import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { visuallyHidden } from "@mui/utils";
import { Box, IconButton, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from "@mui/material";

export const DataTableHead = (props) => {
    const {
        order,
        controller,
        orderBy,
        headCells,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <Tooltip title="Crear">
                        <IconButton component={Link} to={`/${controller}/crear`}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

DataTableHead.propTypes = {
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    controller: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    headCells: PropTypes.array.isRequired,
    onRequestSort: PropTypes.func.isRequired,
};