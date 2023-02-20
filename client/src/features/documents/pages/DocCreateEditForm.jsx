import styled from "@emotion/styled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FaceIcon from "@mui/icons-material/Face";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { produce } from "immer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
	Box,
	Button,
	Chip,
	Container,
	CssBaseline,
	Grid,
	IconButton,
	InputBase,
	Paper,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TextareaAutosize,
	TextField,
	Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NormalDivider from "../../../components/NormalDivider";
import Spinner from "../../../components/Spinner";
import StyledContainer from "../../../components/StyledContainer";
import StyledDivider from "../../../components/StyledDivider";
import StyledTableCell from "../../../components/StyledTableCell";
import StyledTableRow from "../../../components/StyledTableRow";
import currencies from "../../../world_currencies.json";
import {
	useCreateDocMutation,
	useGetSingleDocQuery,
	useUpdateDocMutation,
} from "../documentsApiSlice";

import { useGetAllUserCustomersQuery } from "../../customers/customersApiSlice";
import { addCurrencyCommas } from "./components/addCurrencyCommas";
import DocumentType from "./components/DocumentType";
import { docInitialState, itemsInitialState } from "./initialState";

const StyledItemButton = styled(Button)({
	boxShadow: "0 0 0 0 #f0f0f0, 0 0 0 0 rgba(124, 105, 239, 1)",
});

const DocCreateEditForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: customers } = useGetAllUserCustomersQuery();
	const { data: singleDoc } = useGetSingleDocQuery(id);

	const [createDoc, { isLoading, isSuccess }] = useCreateDocMutation();

	const [
		updateDoc,
		{
			isLoading: updateDocLoading,
			isSuccess: updateDocSuccess,
			data: updateDocData,
		},
	] = useUpdateDocMutation();

	const goBack = () => navigate(-1);

	const [docData, setDocData] = useState(docInitialState);
	const [items, setItems] = useState(itemsInitialState);
	const [documentType, setDocumentType] = useState("Invoice");

	const [currency, setCurrency] = useState(currencies[0].code);

	const today = new Date();

	const [dueDate, setDueDate] = useState(
		today.getTime() + 7 * 24 * 60 * 60 * 1000
	);

	const [customer, setCustomer] = useState(null);
	const [salesTax, setSalesTax] = useState(0);
	const [total, setTotal] = useState(0);
	const [subTotal, setSubTotal] = useState(0);
	const [rates, setRates] = useState(0);
	const [status, setStatus] = useState("Not Paid");

	useEffect(() => {
		if (isSuccess) {
			navigate("/documents");
			toast.success("Your document was created successfully");
		}
		if (updateDocSuccess) {
			navigate("/documents");
			const message = updateDocData?.message;
			toast.success(message);
		}
	}, [navigate, isSuccess, updateDocSuccess, updateDocData]);

	const doc = singleDoc?.document;

	useEffect(() => {
		if (doc) {
			setDocData(doc);
			setItems(doc.billingItems);
			setSubTotal(doc.subTotal);
			setSalesTax(doc.salesTax);
			setTotal(doc.total);
			setCurrency(doc.currency);
			setRates(doc.rates);
			setCustomer(doc.customer);
		}
	}, [doc]);

	useEffect(() => {
		documentType === "Receipt" ? setStatus("Paid") : setStatus("Not Paid");
	}, [documentType]);

	const handleAddBillingItemsRow = (e) => {
		e.preventDefault();
		const insertAt = 0;
		const nextItems = [
			...items.slice(0, insertAt),
			{
				itemName: "",
				unitPrice: "",
				quantity: "",
				discount: "",
			},
			...items.slice(insertAt),
		];
		setItems(nextItems);
	};

	const handleRates = (e) => {
		setRates(e.target.value);
	};

	useEffect(() => {
		const subTotal = () => {
			let amtArr = document.getElementsByName("amount");
			let subtotal = 0;
			for (let i = 0; i < amtArr.length; i++) {
				if (amtArr[i].value) {
					subtotal += +amtArr[i].value;
				}

				setSubTotal(subtotal);
			}
		};

		subTotal();
	}, [docData, items]);

	useEffect(() => {
		const total = () => {
			const finalTotal = (rates / 100) * subTotal + subTotal;
			setSalesTax((rates / 100) * subTotal);
			setTotal(finalTotal);
		};
		total();
	}, [docData, items, rates, subTotal]);

	const createUpdateDocHandler = async (e) => {
		e.preventDefault();
		if (doc) {
			try {
				await updateDoc({
					id: doc._id,
					...docData,
					billingItems: [...items],
					documentType,
					customer,
					dueDate,
					salesTax,
					subTotal,
					total,
					rates,
					currency,
					status,
				});
			} catch (err) {
				const message = err.data.message;
				toast.error(message);
			}
		} else {
			try {
				await createDoc({
					...docData,
					billingItems: [...items],
					documentType,
					customer,
					dueDate,
					salesTax,
					subTotal,
					total,
					rates,
					currency,
					status,
					paymentRecords: [],
				});
			} catch (err) {
				const message = err.data.message;
				toast.error(message);
			}
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
				<NoteAddIcon sx={{ fontSize: 70 }} />
				<Typography variant="h2">Create Document</Typography>
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
			{isLoading || updateDocLoading ? (
				<Spinner />
			) : (
				<Box
					sx={{
						mt: "1rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={createUpdateDocHandler}
				>
					<StyledContainer>
						<Grid container justifyContent="space-between">
							<Grid></Grid>
							<Grid>
								<DocumentType
									documentType={documentType}
									setDocumentType={setDocumentType}
								/>
							</Grid>
						</Grid>
						<NormalDivider />
						<Grid
							container
							justifyContent="space-between"
							sx={{ mt: "30px" }}
						>
							<Grid item sx={{ width: "50%" }}>
								<Container>
									<Typography
										variant="inherit"
										style={{
											color: "#5a5a5a",
											pl: "3px",
											textTransform: "uppercase",
										}}
										gutterBottom
									>
										Send to:
									</Typography>
									{customer && (
										<>
											<Typography
												variant="subtitle1"
												gutterBottom
											>
												<b>Name:</b> {customer?.name}
											</Typography>
											<Typography
												variant="body1"
												gutterBottom
											>
												<b>Email:</b> {customer?.email}
											</Typography>
											<Typography
												variant="body1"
												gutterBottom
											>
												<b>AccountNo:</b>{" "}
												{customer?.accountNo}
											</Typography>
											<Typography
												variant="body1"
												gutterBottom
											>
												<b>VAT/TIN No:</b>{" "}
												{customer?.vatTinNo}
											</Typography>
											<Typography variant="body1">
												<b>Phone Number:</b>{" "}
												{customer?.phoneNumber}
											</Typography>
											<Typography variant="body1">
												<b>Address:</b>{" "}
												{customer?.address}
											</Typography>
											<Button
												sx={{ textTransform: "none" }}
												color="warning"
												size="large"
												onClick={() =>
													setCustomer(null)
												}
												startIcon={
													<ChangeCircleIcon color="warning" />
												}
											>
												choose another customer
											</Button>
										</>
									)}
									<div
										style={
											customer
												? { display: "none" }
												: { display: "block" }
										}
									>
										<Autocomplete
											disablePortal
											sx={{ pt: "10px" }}
											id="customers-list"
											options={
												customers?.myCustomers || []
											}
											getOptionLabel={(option) =>
												option ? option.name : ""
											}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Select a customer"
												/>
											)}
											value={customers?.myCustomers?.name}
											onChange={(event, value) => {
												setCustomer(value);
											}}
										/>
									</div>

									{!customer && (
										<>
											<Grid
												item
												sx={{ pt: "10px", pb: "10px" }}
											>
												<Chip
													color="secondary"
													icon={<FaceIcon />}
													label="Add New Customer"
													onClick={() =>
														navigate(
															"/create-customer"
														)
													}
												/>
											</Grid>
										</>
									)}
								</Container>
							</Grid>

							<Grid
								item
								style={{ marginRight: 20, textAlign: "right" }}
							>
								<Typography
									sx={{
										textTransform: "uppercase",
										color: "#5a5a5a",
									}}
									gutterBottom
								>
									Payment Status
								</Typography>

								<Typography
									variant="h5"
									style={{
										color:
											documentType === "Receipt"
												? "green"
												: "red",
									}}
									gutterBottom
								>
									{documentType === "Receipt"
										? "Paid"
										: "Not Paid"}
								</Typography>

								<Typography
									sx={{
										display: "flex",
										textTransform: "uppercase",
										color: "#5a5a5a",
									}}
									gutterBottom
								>
									<CalendarMonthIcon
										sx={{ alignItems: "center" }}
										fontSize="small"
										color="info"
									/>
									Date of Issue:
								</Typography>
								<Typography gutterBottom>
									<b>{format(new Date(), "do MMMM yyyy")}</b>
								</Typography>

								<Typography
									sx={{
										display: "flex",
										textTransform: "uppercase",
										color: "#5a5a5a",
									}}
									gutterBottom
								>
									<CalendarMonthIcon
										fontSize="small"
										color="warning"
									/>
									Due Date:
								</Typography>
								<Typography variant="body1" gutterBottom>
									<b>
										{dueDate &&
											format(dueDate, "do MMMM yyyy")}
									</b>
								</Typography>

								<Typography
									sx={{
										display: "flex",
										textTransform: "uppercase",
										color: "#5a5a5a",
									}}
									gutterBottom
								>
									<CurrencyExchangeIcon
										fontSize="small"
										color="success"
									/>
									Total Amount:{" "}
								</Typography>
								<Typography variant="h6" gutterBottom>
									{currency}
									{addCurrencyCommas(total.toFixed(2))}
								</Typography>
							</Grid>
						</Grid>

						<NormalDivider />

						<div>
							<TableContainer
								component={Paper}
								sx={{ marginBottom: "100px" }}
							>
								<Table
									sx={{ minWidth: 700 }}
									aria-label="simple-table"
								>
									<TableHead>
										<TableRow>
											<StyledTableCell>#</StyledTableCell>
											<StyledTableCell>
												Product
											</StyledTableCell>
											<StyledTableCell>
												Qty
											</StyledTableCell>
											<StyledTableCell>
												Unit Price
											</StyledTableCell>
											<StyledTableCell>
												Disc(%)
											</StyledTableCell>
											<StyledTableCell>
												Line Total
											</StyledTableCell>
											<StyledTableCell>
												Remove
											</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{items.map((item, index) => (
											<StyledTableRow key={index}>
												<StyledTableCell
													component="th"
													scope="row"
												>
													{index + 1}
												</StyledTableCell>
												<StyledTableCell
													style={{ width: "40%" }}
												>
													<InputBase
														multiline
														style={{
															width: "100%",
														}}
														outline="none"
														sx={{ ml: 1, flex: 1 }}
														type="text"
														onChange={(e) => {
															const itemName =
																e.target.value;
															setItems(
																(currentItem) =>
																	produce(
																		currentItem,
																		(v) => {
																			v[
																				index
																			].itemName =
																				itemName;
																		}
																	)
															);
														}}
														value={item.itemName}
														placeholder="Name/Description"
													/>
												</StyledTableCell>
												{/* quantity */}
												<StyledTableCell align="right">
													<InputBase
														sx={{ ml: 1, flex: 1 }}
														type="number"
														onChange={(e) => {
															const quantity =
																e.target.value;
															setItems(
																(currentItem) =>
																	produce(
																		currentItem,
																		(v) => {
																			v[
																				index
																			].quantity =
																				quantity;
																		}
																	)
															);
														}}
														value={item.quantity}
														placeholder="0"
													/>
												</StyledTableCell>
												{/* unit price */}
												<StyledTableCell align="right">
													<InputBase
														sx={{ ml: 1, flex: 1 }}
														type="number"
														onChange={(e) => {
															const unitPrice =
																e.target.value;
															setItems(
																(currentItem) =>
																	produce(
																		currentItem,
																		(v) => {
																			v[
																				index
																			].unitPrice =
																				unitPrice;
																		}
																	)
															);
														}}
														value={item.unitPrice}
														placeholder="0"
													/>
												</StyledTableCell>

												{/* discount */}
												<StyledTableCell align="right">
													<InputBase
														sx={{ ml: 1, flex: 1 }}
														type="number"
														onChange={(e) => {
															const discount =
																e.target.value;
															setItems(
																(currentItem) =>
																	produce(
																		currentItem,
																		(v) => {
																			v[
																				index
																			].discount =
																				discount;
																		}
																	)
															);
														}}
														value={item.discount}
														placeholder="0"
													/>
												</StyledTableCell>

												{/* line total */}
												<StyledTableCell align="right">
													<InputBase
														sx={{ ml: 1, flex: 1 }}
														disabled
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

												<StyledTableCell align="right">
													<IconButton
														onClick={() => {
															setItems(
																items.filter(
																	(i) =>
																		i.itemName !==
																		item.itemName
																)
															);
															setSubTotal(0);
															setTotal(0);
															setSalesTax(0);
														}}
													>
														<DeleteForeverIcon
															style={{
																width: "20px",
																height: "20px",
															}}
															color="error"
														/>
													</IconButton>
												</StyledTableCell>
											</StyledTableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
							<StyledItemButton
								className="new-customer-btn"
								variant="contained"
								color="success"
								startIcon={<AddCircleOutlineIcon />}
								onClick={handleAddBillingItemsRow}
							>
								Add Product or Service
							</StyledItemButton>
						</div>

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
							<div className="billItem">
								<Typography variant="subtitle1">
									Sub total:
								</Typography>
								<h4>
									{currency} {subTotal.toFixed(2)}
								</h4>
							</div>

							<div className="billItem">
								<Typography variant="subtitle1">
									VAT/Sales Tax:
								</Typography>
								<h4>{salesTax.toFixed(1)}</h4>
							</div>

							<div className="billItem">
								<Typography variant="subtitle1">
									Total:
								</Typography>
								<h4
									style={{
										color: "black",
										fontSize: "18px",
										lineHeight: "8px",
									}}
								>
									{currency}
									{addCurrencyCommas(total.toFixed(2))}
								</h4>
							</div>
						</Box>

						<div className="toolbar">
							<Container>
								<Grid container>
									<Grid
										item
										sx={{
											marginTop: "16px",
											marginRight: 5,
										}}
									>
										<TextField
											type="text"
											step="any"
											name="rates"
											id="rates"
											value={rates}
											onChange={handleRates}
											placeholder="such as 18% etc"
											label="VAT(%)"
										/>
									</Grid>
									<Grid
										item
										sx={{
											marginTop: "16px",
											marginRight: 5,
										}}
									>
										<LocalizationProvider
											dateAdapter={AdapterDateFns}
										>
											<DatePicker
												label="Set Due Date"
												value={dueDate}
												onChange={(date) => {
													setDueDate(date);
												}}
												renderInput={(params) => (
													<TextField {...params} />
												)}
											/>
										</LocalizationProvider>
									</Grid>

									<Grid
										item
										sx={{ width: 255, marginTop: "5px" }}
									>
										<Autocomplete
											disablePortal
											sx={{ pt: "10px" }}
											id="currency-list"
											options={currencies}
											getOptionLabel={(option) =>
												option ? option.currency : ""
											}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Select your currency"
												/>
											)}
											value={currencies.code}
											onChange={(e, value) =>
												setCurrency(value.code)
											}
										/>
									</Grid>
								</Grid>
							</Container>
						</div>

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
									minRows={4}
									style={{
										width: 350,
										border: "solid 1px #d6d6d6",
										padding: "10px",
									}}
									placeholder="Add a special note or memo to your customers,such as payment information/account"
									onChange={(e) =>
										setDocData({
											...docData,
											additionalInfo: e.target.value,
										})
									}
									value={docData.additionalInfo}
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
									minRows={4}
									style={{
										width: 350,
										border: "solid 1px #d6d6d6",
										padding: "10px",
									}}
									placeholder="Add legal terms or conditions, such as your return/refund policy, shipping info, product warranties or privacy policy"
									onChange={(e) =>
										setDocData({
											...docData,
											termsConditions: e.target.value,
										})
									}
									value={docData.termsConditions}
								/>
							</Box>
						</Box>

						<Box sx={{ display: "flex", justifyContent: "center" }}>
							<Button
								variant="outlined"
								type="submit"
								size="large"
								sx={{
									marginTop: "20px",
									borderColor: "rgb(17,65,141)",
									borderRadius: "30px",
									"&:hover": {
										bgcolor: "rgb(17,65,141)",
										color: "white",
										borderColor: "rgb(17,65,141)",
									},
								}}
								startIcon={<SaveAsIcon />}
							>
								Create/Update Doc
							</Button>
						</Box>
					</StyledContainer>
				</Box>
			)}
		</Container>
	);
};

export default DocCreateEditForm;
