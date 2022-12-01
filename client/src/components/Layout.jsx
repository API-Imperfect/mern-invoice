import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<Box sx={{ display: "flex" }}>
			<Box component="main" sx={{ flexGrow: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
