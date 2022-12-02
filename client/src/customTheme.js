import { createTheme } from "@mui/material";

export const customTheme = createTheme({
	palette: {
		background: {
			default: "#f8f9fa",
		},
		indigo: {
			main: "#6610f2",
		},
		orange: {
			main: "#f4511e",
		},
		green: {
			main: "#07f011",
		},
		blue: {
			main: "#34aadc",
		},
		yellow: {
			main: "#f57c00",
		},
		darkRed: {
			main: "#7f0000",
		},
	},
	components: {
		MuiDrawer: {
			styleOverrides: {
				// Name of the slot
				paper: {
					// Some CSS
					backgroundColor: "#000000",
					color: "#fff",
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#000000",
					color: "#fff",
				},
			},
		},
		MuiListItemText: {
			styleOverrides: {
				primary: {
					fontSize: "1.3rem",
				},
			},
		},
	},
});
