import {
	Paper,
	Table,
	TableContainer,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import StyledTableCell from "../../../../components/StyledTableCell";
import StyledTableRow from "../../../../components/StyledTableRow";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import { addCurrencyCommas } from "../../../documents/pages/components/addCurrencyCommas";

const PaymentHistory = ({ sortPaymentHistory }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const rows = sortPaymentHistory;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TableContainer
			component={Paper}
			sx={{ marginBottom: "100px", marginTop: "15px" }}
		>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<StyledTableCell>#</StyledTableCell>
						<StyledTableCell>Paid By</StyledTableCell>
						<StyledTableCell>Date Paid</StyledTableCell>
						<StyledTableCell>Amount Paid</StyledTableCell>
						<StyledTableCell>Payment Method</StyledTableCell>
						<StyledTableCell>Additional Info</StyledTableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{(rowsPerPage > 0
						? rows.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
						  )
						: rows
					).map((row, index) => (
						<StyledTableRow
							key={row?._id}
							sx={{
								"&:last-child td, &:last-child th": {
									border: 0,
								},
								cursor: "pointer",
							}}
						>
							<StyledTableCell component="th" scope="row">
								{page * rowsPerPage + index + 1}
							</StyledTableCell>
							<StyledTableCell>{row?.paidBy}</StyledTableCell>
							<StyledTableCell>
								{moment(row?.datePaid).format("DD-MM-YYYY")}
							</StyledTableCell>
							<StyledTableCell>
								{addCurrencyCommas(row?.amountPaid)}
							</StyledTableCell>
							<StyledTableCell>
								{row?.paymentMethod}
							</StyledTableCell>
							<StyledTableCell>
								{row?.additionalInfo
									? row?.additionalInfo
									: "No additional info"}
							</StyledTableCell>
						</StyledTableRow>
					))}

					{/* control how empty rows shall be displayed should they exist*/}
					{emptyRows > 0 && (
						<TableRow style={{ height: 53 * emptyRows }}>
							<TableCell colSpan={6} />
						</TableRow>
					)}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[
								5,
								10,
								25,
								{ label: "All", value: -1 },
							]}
							colSpan={9}
							count={rows.length}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: {
									"aria-label": "rows per page",
								},
								native: true,
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
};

export default PaymentHistory;
