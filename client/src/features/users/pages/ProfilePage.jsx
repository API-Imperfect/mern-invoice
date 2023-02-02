import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import LoginIcon from "@mui/icons-material/Login";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import PhoneIcon from "@mui/icons-material/Phone";
import PushPinIcon from "@mui/icons-material/PushPin";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import {
	Avatar,
	Box,
	Button,
	Container,
	CssBaseline,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Modal,
	Stack,
	Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import { logOut } from "../../../features/auth/authSlice";
import {
	useDeleteMyAccountMutation,
	useGetUserProfileQuery,
} from "../usersApiSlice";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: "25px",
	boxShadow: 24,
	p: 4,
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const ProfilePage = () => {
	const navigate = useNavigate();
	const { data, error, isLoading, isError } = useGetUserProfileQuery();

	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [deleteMyAccount] = useDeleteMyAccountMutation();

	const deleteHandler = async (e) => {
		e.preventDefault();

		try {
			await deleteMyAccount().unwrap();
			dispatch(logOut());
			toast.success(
				"Your account has been deleted. Sad to see you go 😢"
			);
		} catch (err) {
			const message = err.data.message;
			toast.error(message);
		}
	};

	useEffect(() => {
		if (isError) {
			const message = error.data.message;
			toast.error(message);
		}
	}, [isError, error]);

	return (
		<Container
			component="main"
			maxWidth="md"
			sx={{
				border: "2px solid #e4e5e7",
				borderRadius: "25px",
				py: 2,
				mt: 12,
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
				<BadgeIcon sx={{ fontSize: 80 }} />
				<Typography variant="h1">User Profile</Typography>
			</Box>
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
					<Box>
						{data.userProfile?.avatar ? (
							<Avatar
								src={data.userProfile.avatar}
								sx={{ width: 100, height: 100 }}
							/>
						) : (
							<AccountCircleIcon
								sx={{ fontSize: "6rem" }}
								color="info"
							/>
						)}
					</Box>
					<StyledDivider />
					<Grid container>
						<Grid item md={12} sm={6}>
							<Stack direction="row" spacing={8}>
								<Stack>
									<List>
										{/* provider */}
										<ListItem>
											<ListItemIcon>
												<LoginIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={`Logged in With : ${capitalizeFirstLetter(
													data.userProfile.provider
												)}`}
											/>
										</ListItem>
										{/* email */}
										<ListItem>
											<ListItemIcon>
												<AttachEmailIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={data.userProfile.email}
											/>
										</ListItem>
										{/* first name */}
										<ListItem>
											<ListItemIcon>
												<LabelImportantIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={`First Name: ${data.userProfile.firstName}`}
											/>
										</ListItem>
										{/* last name */}
										<ListItem>
											<ListItemIcon>
												<LabelImportantIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={`Last Name: ${data.userProfile.lastName}`}
											/>
										</ListItem>
										{/* username */}
										<ListItem>
											<ListItemIcon>
												<BadgeIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={`Username: ${data.userProfile.username}`}
											/>
										</ListItem>
										{/* address */}
										<ListItem>
											<ListItemIcon>
												<HomeIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={
													data.userProfile.address
														? `Address : ${data.userProfile?.address}`
														: "Address: ................"
												}
											/>
										</ListItem>
									</List>
								</Stack>
								<Stack>
									<List>
										{/* businessName */}
										<ListItem>
											<ListItemIcon>
												<BusinessIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={
													data.userProfile
														.businessName
														? `Business Name: ${data.userProfile?.businessName}`
														: "Business Name: ................"
												}
											/>
										</ListItem>

										{/* city */}
										<ListItem>
											<ListItemIcon>
												<PushPinIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={
													data.userProfile.city
														? `City: ${data.userProfile?.city}`
														: "City: ................"
												}
											/>
										</ListItem>
										{/* country */}
										<ListItem>
											<ListItemIcon>
												<VpnLockIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={
													data.userProfile.country
														? `Country: ${data.userProfile?.country}`
														: "Country: ................"
												}
											/>
										</ListItem>
										{/* phone */}
										<ListItem>
											<ListItemIcon>
												<PhoneIcon fontSize="large" />
											</ListItemIcon>
											<ListItemText
												primary={
													data.userProfile.phoneNumber
														? `Call me: ${data.userProfile?.phoneNumber}`
														: "Phone: ................"
												}
											/>
										</ListItem>
									</List>
								</Stack>
							</Stack>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item md={6}>
							<Button
								sx={{ mt: 3, mb: 2, borderRadius: "25px" }}
								fullWidth
								variant="contained"
								color="success"
								size="large"
								endIcon={<EditIcon />}
								onClick={() => navigate("/edit-profile")}
							>
								<Typography variant="h5">
									Edit Profile
								</Typography>
							</Button>
						</Grid>
						<Grid item md={6}>
							<Button
								sx={{ mt: 3, mb: 2, borderRadius: "25px" }}
								fullWidth
								variant="contained"
								color="error"
								size="large"
								startIcon={
									<PersonRemoveAlt1Icon
										sx={{ color: "white" }}
									/>
								}
								onClick={handleOpen}
							>
								<Typography
									variant="h5"
									sx={{ color: "white" }}
								>
									Delete Account?
								</Typography>
							</Button>
						</Grid>
					</Grid>

					{/* modal */}
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
								Are you sure you want to delete your account?
							</Typography>
							<Button
								id="modal-modal-description"
								sx={{ mt: 2 }}
								fullWidth
								variant="contained"
								color="darkRed"
								size="large"
								endIcon={
									<DeleteForeverIcon
										sx={{ color: "white" }}
									/>
								}
								onClick={deleteHandler}
							>
								<Typography
									variant="h5"
									sx={{ color: "white" }}
								>
									Delete Account
								</Typography>
							</Button>
						</Box>
					</Modal>
				</Box>
			)}
		</Container>
	);
};

export default ProfilePage;
