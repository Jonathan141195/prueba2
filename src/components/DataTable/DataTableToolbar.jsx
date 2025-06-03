import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";

export const DataTableToolbar = (props) => {
    const { numSelected, title, navigateUpdate } = props;

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
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} Seleccionado
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}

            {numSelected > 0 ? (
                <>
                    <Tooltip title="Borrar">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Actualizar">
                        <IconButton onClick={navigateUpdate}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <Tooltip title="Lista Filtrada">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar >
    );

}

DataTableToolbar.propTypes = {
    title: PropTypes.string.isRequired,
    numSelected: PropTypes.number.isRequired,
    navigateUpdate: PropTypes.func.isRequired,
};