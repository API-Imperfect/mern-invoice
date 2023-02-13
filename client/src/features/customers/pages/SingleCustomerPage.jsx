import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import BadgeIcon from "@mui/icons-material/Badge";
import CottageTwoToneIcon from "@mui/icons-material/CottageTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import NumbersTwoToneIcon from "@mui/icons-material/NumbersTwoTone";
import PermPhoneMsgTwoToneIcon from "@mui/icons-material/PermPhoneMsgTwoTone";
import PushPinTwoToneIcon from "@mui/icons-material/PushPinTwoTone";
import RequestQuoteTwoToneIcon from "@mui/icons-material/RequestQuoteTwoTone";
import VpnLockTwoToneIcon from "@mui/icons-material/VpnLockTwoTone";
import {
	Box,
	Container,
	Button,
	List,
	CssBaseline,
	ListItem,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";

import { GrUser } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import { useGetSingleCustomerQuery } from "../customersApiSlice";

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const SingleCustomerPage = () => {
	const { custId } = useParams();

	const navigate = useNavigate();

	const goBack = () => navigate(-1);

	const { data, isLoading } = useGetSingleCustomerQuery(custId);

	return (
		<Container
			component="main"
			maxWidth="md"
			sx={{
				border: "2px solid  #e4e5e7",
				borderRadius: "25px",
				py: 2,
				mt: 10,
			}}
		>
			<CssBaseline />
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<GrUser fontSize="40px" />
				<Typography variant="h3">
					{data?.customer.name.split(" ")[0]}'s Info
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
			{isLoading ? (
				<Spinner />
			) : (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
						}}
					>
						<List sx={{ width: "50%" }}>
							{/* name` */}
							<ListItem>
								<ListItemIcon>
									<BadgeIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText
									primary={`${capitalizeFirstLetter(
										data?.customer.name
									)}`}
								/>
							</ListItem>
							{/* email` */}
							<ListItem>
								<ListItemIcon>
									<AttachEmailIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText primary={data?.customer.email} />
							</ListItem>
							{/* account No` */}
							<ListItem>
								<ListItemIcon>
									<NumbersTwoToneIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText
									primary={`No : ${data?.customer.accountNo}`}
								/>
							</ListItem>
							{/* VAT/TIN No` */}
							<ListItem>
								<ListItemIcon>
									<RequestQuoteTwoToneIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText
									primary={
										data?.customer.vatTinNo
											? `VAT/TIN : ${data?.customer.vatTinNo}`
											: "VAT/TIN : ...................."
									}
								/>
							</ListItem>
						</List>

						{/* second list */}
						<List sx={{ width: "50%" }}>
							{/*address */}
							<ListItem>
								<ListItemIcon>
									<CottageTwoToneIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText
									primary={
										data?.customer.address
											? `Address : ${data?.customer?.address}`
											: "Address : ...................."
									}
								/>
							</ListItem>

							{/*city */}
							<ListItem>
								<ListItemIcon>
									<PushPinTwoToneIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText
									primary={
										data?.customer.city
											? `City : ${data?.customer.city}`
											: "City : ...................."
									}
								/>
							</ListItem>

							{/*country */}
							<ListItem>
								<ListItemIcon>
									<VpnLockTwoToneIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText
									primary={
										data?.customer.country
											? `Country : ${data?.customer.country}`
											: "Country : ...................."
									}
								/>
							</ListItem>

							{/*phone */}
							<ListItem>
								<ListItemIcon>
									<PermPhoneMsgTwoToneIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText
									primary={
										data?.customer.phoneNumber
											? `Phone : ${data?.customer?.phoneNumber}`
											: "Phone : ...................."
									}
								/>
							</ListItem>
						</List>
					</Box>

					<Stack direction="row" justifyContent="center">
						<Button
							sx={{ mt: 3, mb: 2 }}
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							endIcon={<EditTwoToneIcon />}
							onClick={() =>
								navigate(`/edit-customer/${data?.customer._id}`)
							}
						>
							<Typography variant="h5">
								Edit Customer Info
							</Typography>
						</Button>
					</Stack>
				</Box>
			)}
		</Container>
	);
};

export default SingleCustomerPage;
