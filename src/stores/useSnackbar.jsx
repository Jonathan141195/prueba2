import { create } from "zustand"

export const useSnackbar = create((set) => ({
    visible: false,
    message: null,
    setMessage: (
        message,
        severity = undefined,
        anchorOrigin
    ) => {
        if (message !== null) {
            set({ visible: true, message, severity, anchorOrigin })
        } else {
            set({ visible: false, message: null })
        }
    }
}))