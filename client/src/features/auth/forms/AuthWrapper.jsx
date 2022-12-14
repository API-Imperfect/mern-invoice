import { Box } from "@mui/material";

const AuthWrapper = ({ children }) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "115vh",
			}}
		>
			{children}
		</Box>
	);
};

export default AuthWrapper;
