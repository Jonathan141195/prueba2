import { Alert, Snackbar as MuiSnackbar } from "@mui/material"
import { useSnackbar } from "../../stores/useSnackbar"

export const Snackbar = () => {
    const isVisible = useSnackbar((state) => state.visible)
    const message = useSnackbar((state) => state.message)
    const severity = useSnackbar((state) => state.severity)
    const setMessage = useSnackbar((state) => state.setMessage)
    const anchorOrigin = useSnackbar((state) => state.anchorOrigin)

    return (
        <MuiSnackbar
            autoHideDuration={4000}
            open={isVisible}
            onClose={() => { setMessage(null) }}
            anchorOrigin={anchorOrigin}
        >
            <Alert severity={severity}>{message}</Alert>
        </MuiSnackbar>
    )
}