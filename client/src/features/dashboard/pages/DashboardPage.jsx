import AlarmTwoToneIcon from "@mui/icons-material/AlarmTwoTone";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import DashboardTwoToneIcon from "@mui/icons-material/DashboardTwoTone";
import DifferenceTwoToneIcon from "@mui/icons-material/DifferenceTwoTone";
import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";
import HistoryEduTwoToneIcon from "@mui/icons-material/HistoryEduTwoTone";
import PaidTwoToneIcon from "@mui/icons-material/PaidTwoTone";
import SavingsTwoToneIcon from "@mui/icons-material/SavingsTwoTone";
import SentimentDissatisfiedTwoToneIcon from "@mui/icons-material/SentimentDissatisfiedTwoTone";
import SentimentSatisfiedAltTwoToneIcon from "@mui/icons-material/SentimentSatisfiedAltTwoTone";
import { Box, Container, CssBaseline, Grid, Typography } from "@mui/material";
import StyledDashboardGrid from "../../../components/StyledDashboardGrid";
import StyledDivider from "../../../components/StyledDivider";
import { useGetAllUserCustomersQuery } from "../../customers/customersApiSlice";
import { useGetAllMyDocsQuery } from "../../documents/documentsApiSlice";
import { addCurrencyCommas } from "../../documents/pages/components/addCurrencyCommas";
import PaymentHistory from "./components/paymentHistory";
import useTitle from "../../../hooks/useTitle";

const DashboardPage = () => {
	useTitle("My Dashboard - MERN Invoice");
	const { data: customers } = useGetAllUserCustomersQuery();
	const { data: documents } = useGetAllMyDocsQuery();

	let totalRecieved = 0;
	for (let i = 0; i < documents?.myDocuments?.length; i++) {
		if (documents?.myDocuments[i]?.totalAmountReceived !== undefined) {
			totalRecieved += documents?.myDocuments[i]?.totalAmountReceived;
		}
	}

	const docOverDue = documents?.myDocuments?.filter(
		(doc) => doc.dueDate <= new Date().toISOString()
	);

	let paymentHistory = [];
	for (let i = 0; i < documents?.myDocuments?.length; i++) {
		let history = [];
		if (documents?.myDocuments[i]?.paymentRecords !== undefined) {
			history = [
				...paymentHistory,
				documents?.myDocuments[i]?.paymentRecords,
			];
			paymentHistory = [].concat.apply([], history);
		}
	}

	const sortPaymentHistory = paymentHistory.sort(function (a, b) {
		const c = new Date(a.datePaid);
		const d = new Date(b.datePaid);

		return d - c;
	});

	let totalAmount = 0;
	for (let i = 0; i < documents?.myDocuments?.length; i++) {
		totalAmount += documents?.myDocuments[i]?.total;
	}

	const fullyPaid = documents?.myDocuments?.filter(
		(doc) => doc.status === "Paid"
	);

	const partiallyPaid = documents?.myDocuments?.filter(
		(doc) => doc.status === "Not Fully Paid"
	);

	const notPaid = documents?.myDocuments?.filter(
		(doc) => doc.status === "Not Paid"
	);

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
				<DashboardTwoToneIcon sx={{ fontSize: 70 }} />
				<Typography variant="h2">My Dashboard</Typography>
			</Box>
			<StyledDivider />
			<Box>
				<Grid container spacing={2}>
					{/* customers */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<SentimentSatisfiedAltTwoToneIcon
								color="primary"
								sx={{ fontSize: 30 }}
							/>
							<Typography variant="h5" sx={{ marginLeft: 1 }}>
								{customers?.totalCustomers}
							</Typography>
						</Box>
						<Typography variant="h6">Total Customers</Typography>
					</StyledDashboardGrid>
					{/* total documents */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<DifferenceTwoToneIcon
								color="success"
								sx={{ fontSize: 30 }}
							/>
							<Typography variant="h5" sx={{ marginLeft: 1 }}>
								{documents?.totalDocuments}
							</Typography>
						</Box>
						<Typography variant="h6">Total Documents</Typography>
					</StyledDashboardGrid>
					{/* total amount */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<SavingsTwoToneIcon
								color="secondary"
								sx={{ fontSize: 30 }}
							/>
							<Typography variant="h5" sx={{ marginLeft: 1 }}>
								{addCurrencyCommas(totalAmount.toFixed(2))}
							</Typography>
						</Box>
						<Typography variant="h6">Expected Income</Typography>
					</StyledDashboardGrid>
					{/* total paid */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<PaidTwoToneIcon
								sx={{ fontSize: 30, color: "#ff9100" }}
							/>
							<Typography variant="h6" sx={{ marginLeft: 1 }}>
								{addCurrencyCommas(totalRecieved)}
							</Typography>
						</Box>
						<Typography variant="h6">Cash Received</Typography>
					</StyledDashboardGrid>
					{/* pending amount */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<SentimentDissatisfiedTwoToneIcon
								sx={{ fontSize: 30, color: "#ff3d00" }}
							/>
							<Typography variant="h5" sx={{ marginLeft: 1 }}>
								{addCurrencyCommas(
									(totalAmount - totalRecieved).toFixed(2)
								)}
							</Typography>
						</Box>
						<Typography variant="h6">Cash Pending</Typography>
					</StyledDashboardGrid>
					{/* Fully paid docs */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<DoneAllTwoToneIcon
								sx={{ fontSize: 30, color: "#651fff" }}
							/>
							<Typography variant="h6" sx={{ marginLeft: 1 }}>
								{fullyPaid?.length}
							</Typography>
						</Box>
						<Typography variant="h6">Total Paid Docs</Typography>
					</StyledDashboardGrid>
					{/* Partially Paid */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<CloseTwoToneIcon
								sx={{ fontSize: 30, color: "#2196f3" }}
							/>
							<Typography variant="h6" sx={{ marginLeft: 1 }}>
								{partiallyPaid?.length}
							</Typography>
						</Box>
						<Typography variant="h6">Not Fully Paid</Typography>
					</StyledDashboardGrid>
					{/* overdue */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<AlarmTwoToneIcon
								sx={{ fontSize: 30, color: "#006064" }}
							/>
							<Typography variant="h6" sx={{ marginLeft: 1 }}>
								{docOverDue?.length}
							</Typography>
						</Box>
						<Typography variant="h6">Overdue</Typography>
					</StyledDashboardGrid>
					{/* unpaid */}
					<StyledDashboardGrid>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<SentimentDissatisfiedTwoToneIcon
								sx={{ fontSize: 30, color: "#455a64" }}
							/>
							<Typography variant="h6" sx={{ marginLeft: 1 }}>
								{notPaid?.length}
							</Typography>
						</Box>
						<Typography variant="h6">UnPaid</Typography>
					</StyledDashboardGrid>
				</Grid>
			</Box>
			<Box
				sx={{
					mt: 3,
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<HistoryEduTwoToneIcon sx={{ fontSize: 60 }} />
				<Typography variant="h3">
					{paymentHistory?.length
						? "Payment History"
						: "No Payments as of now"}
				</Typography>
			</Box>
			<StyledDivider />
			<PaymentHistory sortPaymentHistory={sortPaymentHistory} />
		</Container>
	);
};

export default DashboardPage;
