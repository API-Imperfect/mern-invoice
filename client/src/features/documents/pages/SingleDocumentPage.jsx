import AttachEmailIcon from "@mui/icons-material/AttachEmail";

import EditIcon from "@mui/icons-material/Edit";
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Container,
	CssBaseline,
	Grid,
	InputBase,
	Paper,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TextareaAutosize,
	Typography,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaUserSecret } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import NormalDivider from "../../../components/NormalDivider";
import Spinner from "../../../components/Spinner";
import StyledContainer from "../../../components/StyledContainer";
import StyledDivider from "../../../components/StyledDivider";
import StyledTableCell from "../../../components/StyledTableCell";
import StyledTableRow from "../../../components/StyledTableRow";
import { useGetUserProfileQuery } from "../../users/usersApiSlice.js";
import { useGetSingleDocQuery } from "../documentsApiSlice";
import { addCurrencyCommas } from "./components/addCurrencyCommas";
import { statusColor } from "./components/styling";
import PaymentForm from "./PaymentForm";

const SingleDocumentPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const goBack = () => navigate(-1);

	const { data: docData, isLoading } = useGetSingleDocQuery(id);
	const { data: profileData } = useGetUserProfileQuery();

	const [status, setStatus] = useState("");
	const [totalAmountReceived, setTotalAmountReceived] = useState(0);

	const [sendEmail, setSendEmail] = useState(false);

	const document = docData?.document;
	const profile = profileData?.userProfile;

	useEffect(() => {
		if (document) {
			setStatus(document?.status);
		}
	}, [document]);

	useEffect(() => {
		//Get the total amount paid
		let totalReceived = 0;
		for (var i = 0; i < document?.paymentRecords?.length; i++) {
			totalReceived += Number(document?.paymentRecords[i]?.amountPaid);
			setTotalAmountReceived(totalReceived);
		}
	}, [document]);

	const sendPdfEmail = () => {
		setSendEmail(true);

		axios
			.post(`/api/v1/document/send-pdf`, {
				profile,
				document,
				status,
				totalAmountReceived,
			})
			.then(() => setSendEmail(false))
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<Container component="main" maxWidth="md" sx={{ mt: 10 }}>
			<CssBaseline />
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<FaUserSecret fontSize="35px" />
				<Typography variant="h3">
					{document?.customer?.name.split(" ")[0]}'s Doc
				</Typography>
				<Button
					variant="contained"
					color="warning"
					size="small"
					sx={{ fontSize: "1rem", ml: "10px" }}
					onClick={goBack}
				>
					Go Back
				</Button>
			</Box>

			<StyledDivider />

			<Grid container spacing={2} sx={{ mt: "30px" }}>
				<Grid item md={6}>
					<Button
						sx={{ borderRadius: "50px", cursor: "pointer" }}
						fullWidth
						variant="outlined"
						color="primary"
						size="small"
						startIcon={<EditIcon fontSize="large" />}
						onClick={() => navigate(`/edit-doc/${document._id}`)}
					>
						<Typography variant="h5">
							{" "}
							Edit {document?.documentType}
						</Typography>
					</Button>
				</Grid>

				<Grid item md={6}>
					{sendEmail ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<CircularProgress />
						</Box>
					) : (
						<Button
							sx={{
								borderRadius: "50px",
								cursor: "pointer",
							}}
							fullWidth
							variant="outlined"
							color="secondary"
							size="small"
							startIcon={<AttachEmailIcon />}
							onClick={sendPdfEmail}
						>
							<Typography variant="h5">
								Email {document?.documentType} to Customer
							</Typography>
						</Button>
					)}
				</Grid>

				{/* <Grid item md={4}>
					{downloading ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<CircularProgress />
						</Box>
					) : (
						<Button
							sx={{
								borderRadius: "50px",
								cursor: "pointer",
							}}
							fullWidth
							variant="outlined"
							color="success"
							size="small"
							startIcon={<CloudDownloadIcon />}
							onClick={createAndDownloadPdf}
						>
							<Typography variant="h5">Generate PDF</Typography>
						</Button>
					)}
				</Grid> */}
			</Grid>

			{isLoading ? (
				<Spinner />
			) : (
				<Box
					sx={{
						mt: "1rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<StyledContainer>
						<Grid
							container
							direction="row"
							alignItems="center"
							justifyContent="space-between"
						>
							<Grid item>
								<Box>
									{profile?.avatar ? (
										<Avatar
											src={profile?.avatar}
											sx={{
												width: 150,
												height: 150,
												cursor: "pointer",
											}}
											variant="square"
											onClick={() => navigate("/profile")}
										/>
									) : (
										<Typography variant="h2">
											{profile?.businessName}
										</Typography>
									)}
								</Box>
							</Grid>
							<Grid item>
								<Typography variant="h2" gutterBottom>
									{document?.documentType}
								</Typography>
								<Typography
									variant="h6"
									sx={{ color: "#5a5a5a" }}
								>
									<b> No: {document?.documentNumber}</b>
								</Typography>
							</Grid>
						</Grid>
						<NormalDivider />
						<Grid
							container
							justifyContent="space-between"
							sx={{ mt: "30px" }}
						>
							<Grid item>
								<Box>
									<Typography
										variant="h6"
										gutterBottom
										sx={{ textTransform: "uppercase" }}
									>
										<b>From :</b>
									</Typography>
									<Typography variant="body1" gutterBottom>
										{profile?.businessName}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{profile?.email}
									</Typography>

									<Typography variant="body1" gutterBottom>
										{profile?.phoneNumber}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{profile?.address}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{profile?.city}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{profile?.country}
									</Typography>
								</Box>
							</Grid>

							<Grid item>
								<Box>
									<Typography
										variant="h6"
										gutterBottom
										sx={{
											textTransform: "uppercase",
										}}
									>
										<b>For: </b>
									</Typography>
									<Typography variant="body1" gutterBottom>
										{document?.customer?.name}
									</Typography>
									<Typography variant="body1" gutterBottom>
										<b>Customer No:</b>{" "}
										{document?.customer?.accountNo}
									</Typography>
									<Typography variant="body1" gutterBottom>
										<b>VAT/TIN No:</b>{" "}
										{document?.customer?.vatTinNo}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{document?.customer?.email}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{document?.customer?.phoneNumber}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{document?.customer?.address}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{document?.customer?.city}
									</Typography>
									<Typography variant="body1" gutterBottom>
										{document?.customer?.country}
									</Typography>
								</Box>
							</Grid>

							<Grid item>
								<Box>
									<Typography
										variant="h6"
										gutterBottom
										sx={{
											textTransform: "uppercase",
										}}
									>
										<b>Payment Status:</b>
									</Typography>

									<Typography
										variant="h5"
										gutterBottom
										style={{
											color: statusColor(
												totalAmountReceived,
												status
											),
											fontWeight: "bold",
										}}
									>
										{totalAmountReceived >= document?.total
											? "Paid"
											: status}
									</Typography>
									<Typography variant="body1" gutterBottom>
										<b>Issue Date:</b>{" "}
										{format(
											new Date(document?.createdAt),
											"do MMMM yyyy"
										)}
									</Typography>

									<Typography variant="body1" gutterBottom>
										<strong>Due Date:</strong>{" "}
										{format(
											new Date(document?.dueDate),
											"do MMMM yyyy"
										)}
									</Typography>

									<Typography variant="body1" gutterBottom>
										<strong>Total Amount:</strong>{" "}
									</Typography>
									<Typography
										variant="h5"
										gutterBottom
										sx={{ color: "#2979ff" }}
									>
										{document?.currency}{" "}
										{addCurrencyCommas(
											document?.total.toFixed(2)
										)}
									</Typography>
								</Box>
							</Grid>
						</Grid>
						<NormalDivider />

						<>
							<Typography
								variant="h6"
								sx={{
									textAlign: "center",
									textTransform: "uppercase",
								}}
								gutterBottom
							>
								Order Details
							</Typography>
							<TableContainer
								component={Paper}
								sx={{ marginBottom: "100px" }}
							>
								<Table
									sx={{ minWidth: 700 }}
									aria-label="simple table"
								>
									<TableHead>
										<TableRow>
											<StyledTableCell>#</StyledTableCell>
											<StyledTableCell>
												Product/Service
											</StyledTableCell>
											<StyledTableCell>
												Qty
											</StyledTableCell>
											<StyledTableCell>
												Unit Price/Rate
											</StyledTableCell>
											<StyledTableCell>
												Disc(%)
											</StyledTableCell>
											<StyledTableCell>
												Line Total ({document?.currency}{" "}
												)
											</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{document?.billingItems?.map(
											(item, index) => (
												<StyledTableRow key={index}>
													<StyledTableCell
														component="th"
														scope="row"
													>
														{index + 1}
													</StyledTableCell>
													<StyledTableCell
														style={{ width: "25%" }}
													>
														<InputBase
															style={{
																width: "100%",
															}}
															readOnly
															outline="none"
															sx={{
																ml: 1,
																flex: 1,
															}}
															type="text"
															name="name"
															value={
																item.itemName
															}
														/>
													</StyledTableCell>

													<StyledTableCell>
														<InputBase
															style={{
																width: "100%",
															}}
															readOnly
															outline="none"
															sx={{
																ml: 1,
																flex: 1,
															}}
															type="number"
															name="quantity"
															value={
																item.quantity
															}
														/>
													</StyledTableCell>

													<StyledTableCell>
														<InputBase
															style={{
																width: "100%",
															}}
															readOnly
															outline="none"
															sx={{
																ml: 1,
																flex: 1,
															}}
															type="number"
															name="unitPrice"
															value={
																item.unitPrice
															}
														/>
													</StyledTableCell>

													<StyledTableCell>
														<InputBase
															style={{
																width: "100%",
															}}
															readOnly
															outline="none"
															sx={{
																ml: 1,
																flex: 1,
															}}
															type="number"
															name="discount"
															value={
																item.discount
															}
														/>
													</StyledTableCell>

													<StyledTableCell>
														<InputBase
															style={{
																width: "100%",
															}}
															readOnly
															outline="none"
															sx={{
																ml: 1,
																flex: 1,
															}}
															type="number"
															name="amount"
															value={(
																item?.quantity *
																	item.unitPrice -
																(item.quantity *
																	item.unitPrice *
																	item.discount) /
																	100
															).toFixed(2)}
														/>
													</StyledTableCell>
												</StyledTableRow>
											)
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</>

						<Box
							sx={{
								marginLeft: "50%",
								textAlign: "left",
								borderBottom: "1px solid rgb(17,65,141)",
							}}
						>
							<Typography variant="h6" className="title">
								Cost Summary
							</Typography>
							<Box className="billItem">
								<Typography variant="subtitle1">
									Sub total:
								</Typography>
								<h4>
									{" "}
									{document?.currency}{" "}
									{addCurrencyCommas(
										document?.subTotal.toFixed(2)
									)}
								</h4>
							</Box>

							<Box className="billItem">
								<Typography variant="subtitle1">
									{`VAT/Sales Tax (${document?.rates}%):`}
								</Typography>
								<h4>{document?.salesTax.toFixed(2)}</h4>
							</Box>

							<Box className="billItem">
								<Typography variant="subtitle1">
									Cumulative Total :
								</Typography>
								<h4>
									{" "}
									{document?.currency}{" "}
									{addCurrencyCommas(
										document?.total.toFixed(2)
									)}
								</h4>
							</Box>

							<Box className="billItem">
								<Typography variant="subtitle1">
									Amount Paid :
								</Typography>
								<h4>
									{" "}
									{document?.currency}{" "}
									{addCurrencyCommas(
										totalAmountReceived.toFixed(2)
									)}
								</h4>
							</Box>

							<Box className="billItem">
								<Typography variant="subtitle1">
									Balance :
								</Typography>
								<h4>
									{" "}
									{document?.currency}{" "}
									{addCurrencyCommas(
										Math.round(
											document?.total -
												totalAmountReceived
										).toFixed(2)
									)}
								</h4>
							</Box>
						</Box>

						<Box
							sx={{
								marginTop: "20px",
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Box item>
								<Typography
									variant="h4"
									sx={{ color: "rgb(17,65,141)" }}
								>
									Additional Info
								</Typography>
								<NormalDivider />
								<TextareaAutosize
									disabled
									minRows={4}
									style={{
										width: 350,
										border: "solid 1px #d6d6d6",
										padding: "10px",
									}}
									value={document?.additionalInfo}
								/>
							</Box>
							<Box>
								<Typography
									variant="h4"
									sx={{ color: "rgb(17,65,141)" }}
								>
									Terms & Conditions
								</Typography>
								<NormalDivider />
								<TextareaAutosize
									disabled
									minRows={4}
									style={{
										width: 350,
										border: "solid 1px #d6d6d6",
										padding: "10px",
									}}
									value={document?.termsConditions}
								/>
							</Box>
						</Box>
					</StyledContainer>

					<Grid container sx={{ mb: "80px", mt: "-50px" }}>
						<Grid item md={12}>
							<Typography
								variant="h5"
								component={"span"}
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									backgroundColor: "#651fff",
									color: "#fff",
									padding: 1,
								}}
							>
								{`Record any payment by ${
									document?.customer.name.split(" ")[0]
								}`}
							</Typography>

							<PaymentForm document={document} />
						</Grid>
					</Grid>
				</Box>
			)}
		</Container>
	);
};

export default SingleDocumentPage;
