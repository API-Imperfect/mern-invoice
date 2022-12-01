import { styled, TableCell, tableCellClasses } from "@mui/material";

const TableCellStyled = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 15,
	},
}));

const StyledTableCell = ({ children }) => {
	return <TableCellStyled>{children}</TableCellStyled>;
};

export default StyledTableCell;
