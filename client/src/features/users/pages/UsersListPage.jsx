import {
	Box,
	Badge,
	Container,
	CssBaseline,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Checkbox,
	Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import GroupIcon from "@mui/icons-material/Group";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdOutlineBadge } from "react-icons/md";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import StyledTableCell from "../../../components/StyledTableCell";
import StyledTableRow from "../../../components/StyledTableRow";
import TablePaginationActions from "../../../components/TablePaginationActions";
import useTitle from "../../../hooks/useTitle";
import { useGetAllUsersQuery } from "../usersApiSlice";

const UserListPage = () => {
	useTitle("All Users - MERN Invoice");

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery(
		"allUsersList",
		{
			pollingInterval: 60000,
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
		}
	);

	const rows = data?.users;

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	useEffect(() => {
		if (isError) {
			const message = error.data.message;
			toast.error(message);
		}
	}, [error, isError]);

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
				<MdOutlineBadge className="auth-svg" />
				<Typography variant="h1"> Users</Typography>
			</Box>
			<StyledDivider />
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
				}}
			>
				<Typography variant="h4"> Total: </Typography>
				<Badge
					badgeContent={data?.count}
					color="primary"
					sx={{ marginTop: "3px", marginLeft: "5px" }}
				>
					<GroupIcon color="action" fontSize="large" />
				</Badge>
			</Box>
			{isLoading ? (
				<Spinner />
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="user table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Email</StyledTableCell>
								<StyledTableCell align="right">
									Username
								</StyledTableCell>
								<StyledTableCell align="right">
									Provider
								</StyledTableCell>
								<StyledTableCell align="right">
									isEmailVerified
								</StyledTableCell>
								<StyledTableCell align="right">
									Roles
								</StyledTableCell>
								<StyledTableCell align="right">
									Joined
								</StyledTableCell>
								<StyledTableCell align="right">
									Active Users
								</StyledTableCell>
								<StyledTableCell align="right">
									Delete
								</StyledTableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{isSuccess && (
								<>
									{(rowsPerPage > 0
										? rows.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
										  )
										: rows
									).map((row, index) => (
										<StyledTableRow
											key={row._id}
											sx={{
												"&:last-chid td, &:last-child th":
													{ border: 0 },
											}}
										>
											<StyledTableCell
												component="th"
												scope="row"
											>
												{row.email}
											</StyledTableCell>
											<StyledTableCell align="right">
												{row.username}
											</StyledTableCell>
											<StyledTableCell align="right">
												{row.provider}
											</StyledTableCell>
											<StyledTableCell align="right">
												{row.isEmailVerified.toString()}
											</StyledTableCell>
											<StyledTableCell align="right">
												{row.roles
													.toString()
													.replace(",", ", ")}
											</StyledTableCell>
											<StyledTableCell align="right">
												{moment(row?.dueDate).format(
													"DD-MM-YYYY"
												)}
											</StyledTableCell>
											<StyledTableCell align="right">
												<Box>
													<Checkbox />
												</Box>
											</StyledTableCell>
											<StyledTableCell align="right">
												<Box>
													<ClearIcon
														color="error"
														fontSize="medium"
														sx={{
															cursor: "pointer",
														}}
													/>
												</Box>
											</StyledTableCell>
										</StyledTableRow>
									))}
								</>
							)}
							{/* control how emptyRows are displayed */}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
						{/* footer with pagination */}
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
									count={rows?.length}
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

export default UserListPage;
