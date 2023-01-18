import { Box, Typography } from "@mui/material";

const UserListPage = () => {
	return (
		<Box sx={{ display: "flex", marginLeft: "250px", mt: 10 }}>
			<Typography variant="h3">
				This Admin page can only be viewed by Admin users
			</Typography>
		</Box>
	);
};

export default UserListPage;
