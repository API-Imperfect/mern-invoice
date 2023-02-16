import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
	Box,
	Badge,
	Button,
	Container,
	CssBaseline,
	Modal,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import StyledTableCell from "../../../components/StyledTableCell";
import StyledTableRow from "../../../components/StyledTableRow";
import TablePaginationActions from "../../../components/TablePaginationActions";
import {
	useDeleteDocMutation,
	useGetAllMyDocsQuery,
} from "../documentsApiSlice";
import DocumentSVG from "./components/DocumentSVG";
import { DocumentTypeStyling, statusStyling } from "./components/styling";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: "25px",
	boxShadow: 24,
	p: 4,
};

const StyledButton = styled(Button)({
	boxShadow: "0 0 0 0 #f0f0f0, 0 0 0 0 rgba(124, 105, 239, 1)",
});

const DocumentsPage = () => {
	const navigate = useNavigate();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const { data, isLoading } = useGetAllMyDocsQuery(page);

	const [deleteDoc] = useDeleteDocMutation();

	const rows = data?.myDocuments;

	const [open, setOpen] = useState(false);

	const [selectedDoc, setSelectedDoc] = useState("");

	const handleOpen = (document) => {
		setSelectedDoc(document);
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const deleteDocumentHandler = async (id) => {
		try {
			const response = await deleteDoc(id).unwrap();
			toast.success(`${response.message}`);
		} catch (err) {
			toast.error("The document could not be deleted");
		}
	};

	return (
		<Container component="main" maxWidth="lg" sx={{ mt: 10 }}>
			<CssBaseline />

			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<GiTakeMyMoney className="auth-svg" />
				<Typography variant="h1">Documents</Typography>
			</Box>

			<StyledDivider />

			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					<Typography variant="h4">Total Documents: </Typography>
					<Badge
						badgeContent={data?.totalDocuments || "0"}
						color="success"
						sx={{
							margin: "3px 0 5px 5px",
						}}
					>
						<GiReceiveMoney color="action" fontSize={45} />
					</Badge>
				</Box>

				<StyledButton
					className="new-customer-btn"
					variant="contained"
					color="success"
					startIcon={<ReceiptLongIcon />}
					onClick={() => navigate("/create-doc")}
				>
					Create New Document
				</StyledButton>
			</Box>

			{isLoading ? (
				<Spinner />
			) : !rows.length ? (
				<DocumentSVG />
			) : (
				<TableContainer
					component={Paper}
					sx={{ marginBottom: "100px", marginTop: "15px" }}
				>
					{isLoading && <Spinner />}
					<Table sx={{ minWidth: 650 }} aria-label="simple-table">
						<TableHead>
							<TableRow>
								<StyledTableCell>#</StyledTableCell>
								<StyledTableCell>Doc No</StyledTableCell>
								<StyledTableCell>Type</StyledTableCell>
								<StyledTableCell>Customer</StyledTableCell>
								<StyledTableCell>Amount</StyledTableCell>
								<StyledTableCell>Due Date</StyledTableCell>
								<StyledTableCell>
									Payment Status
								</StyledTableCell>
								<StyledTableCell>View</StyledTableCell>
								<StyledTableCell>Delete</StyledTableCell>
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

									<StyledTableCell component="th" scope="row">
										{row?.documentNumber}
									</StyledTableCell>

									<StyledTableCell component="th" scope="row">
										<button
											style={DocumentTypeStyling(
												row.documentType
											)}
										>
											{row?.documentType}
										</button>
									</StyledTableCell>

									<StyledTableCell component="th" scope="row">
										{row?.customer?.name}
									</StyledTableCell>

									<StyledTableCell component="th" scope="row">
										{row?.total?.toFixed(2)}
									</StyledTableCell>

									<StyledTableCell component="th" scope="row">
										{moment(row?.dueDate).format(
											"DD-MM-YYYY"
										)}
									</StyledTableCell>

									<StyledTableCell component="th" scope="row">
										<button
											style={statusStyling(row.status)}
										>
											{row?.status}
										</button>
									</StyledTableCell>

									<StyledTableCell align="center">
										<Box
											sx={{
												"&:hover": {
													cursor: "pointer",
												},
											}}
										>
											<FaEye
												color="error"
												fontSize="medium"
												onClick={() =>
													navigate(
														`/document/${row._id}`
													)
												}
											/>
										</Box>
									</StyledTableCell>

									<StyledTableCell align="center">
										<Box
											sx={{
												"&:hover": {
													cursor: "pointer",
												},
											}}
										>
											<ClearIcon
												color="error"
												fontSize="medium"
												onClick={() => handleOpen(row)}
											/>
										</Box>
									</StyledTableCell>
								</StyledTableRow>
							))}

							{open && (
								<Modal
									open={open}
									onClose={handleClose}
									aria-labelledby="modal-modal-title"
									aria-describedby="modal-modal-description"
								>
									<Box sx={modalStyle}>
										<Typography
											id="modal-modal-title"
											variant="h6"
											component="h2"
										>
											{`Are you sure you want to delete this ${selectedDoc.documentType}, with number ${selectedDoc.documentNumber}, belonging to ${selectedDoc.customer.name}?`}
										</Typography>
										<Button
											id="modal-modal-description"
											sx={{ mt: 2 }}
											color="darkRed"
											size="large"
											fullWidth
											variant="contained"
											endIcon={
												<DeleteForeverIcon
													sx={{ color: "white" }}
												/>
											}
											onClick={() => {
												deleteDocumentHandler(
													`${selectedDoc._id}`
												);
												handleClose();
											}}
										>
											<Typography
												variant="h5"
												sx={{ color: "white" }}
											>
												Delete Document
											</Typography>
										</Button>
									</Box>
								</Modal>
							)}
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
									onRowsPerPageChange={
										handleChangeRowsPerPage
									}
									ActionsComponent={TablePaginationActions}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
};

export default DocumentsPage;
