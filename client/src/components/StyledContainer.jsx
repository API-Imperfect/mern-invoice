import { Box, styled } from "@mui/material";

const StyledBox = styled(Box)({
	width: "100%",
	margin: "20px auto 100px auto",
	borderRadius: "10px",
	padding: "20px",
	boxShadow: "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.6)",
});

const StyledContainer = ({ children }) => {
	return <StyledBox>{children}</StyledBox>;
};

export default StyledContainer;
