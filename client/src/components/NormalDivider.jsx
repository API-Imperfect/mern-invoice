import { Divider, styled } from "@mui/material";

const DividerStyle = styled(Divider)({
	height: "3px",
	backgroundColor: "rgb(17,65,141)",
	marginBottom: "20px",
	marginTop: "25px",
});

const NormalDivider = () => {
	return <DividerStyle />;
};

export default NormalDivider;
