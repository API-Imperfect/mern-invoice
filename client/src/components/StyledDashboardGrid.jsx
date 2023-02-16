import { Box, Grid, styled } from "@mui/material";

const StyledBox = styled(Box)({
	width: "100%",
	marginTop: "20px",
	marginLeft: "auto",
	marginRight: "auto",
	borderRadius: "10px",
	padding: "20px",
	border: "1px dashed #5a5a5a",
	borderWidth: "2px",
});

const StyledDashboardGrid = ({ children }) => {
	return (
		<Grid item md={3}>
			<StyledBox>{children}</StyledBox>
		</Grid>
	);
};

export default StyledDashboardGrid;
