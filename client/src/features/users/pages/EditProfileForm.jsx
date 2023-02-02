import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import CheckIcon from "@mui/icons-material/Check";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
	Box,
	Button,
	CircularProgress,
	Container,
	CssBaseline,
	Grid,
	styled,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import Spinner from "../../../components/Spinner";

import StyledDivider from "../../../components/StyledDivider";
import useTitle from "../../../hooks/useTitle";

import {
	useGetUserProfileQuery,
	useUpdateUserProfileMutation,
} from "../usersApiSlice";

const Input = styled("input")({
	display: "none",
});

const EditProfileForm = () => {
	useTitle("Edit Profile - MERN Invoice");
	const navigate = useNavigate();
	const goBack = () => navigate(-1);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const isValidPhoneNumber = validator.isMobilePhone(phoneNumber);
	const [address, setAddress] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");

	const [avatar, setAvatar] = useState("");
	const [uploading, setUploading] = useState(false);

	const { data } = useGetUserProfileQuery();

	const [updateMyProfile, { data: updateData, isLoading, isSuccess }] =
		useUpdateUserProfileMutation();

	useEffect(() => {
		const userProfile = data?.userProfile;
		if (userProfile) {
			setFirstName(userProfile.firstName);
			setLastName(userProfile.lastName);
			setUsername(userProfile.username);
			setPhoneNumber(userProfile.phoneNumber);
			setBusinessName(userProfile.businessName);
			setCity(userProfile.city);
			setAddress(userProfile.address);
			setCountry(userProfile.country);
			setAvatar(userProfile.avatar);
		}
	}, [data]);

	useEffect(() => {
		if (isSuccess) {
			navigate("/profile");
			const message = updateData?.message;
			toast.success(message);
		}
	}, [updateData, isSuccess, navigate]);

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("logo", file);
		setUploading(true);

		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};

			const { data } = await axios.patch(
				"/api/v1/upload",
				formData,
				config
			);
			setAvatar(data);
			setUploading(false);
		} catch (error) {
			setUploading(false);
		}
	};

	const updateHandler = async (e) => {
		e.preventDefault();
		try {
			const userData = {
				firstName,
				lastName,
				username,
				phoneNumber,
				businessName,
				address,
				city,
				country,
				avatar,
			};
			await updateMyProfile(userData).unwrap();
		} catch (err) {
			const message = err.data.message;
			toast.error(message);
		}
	};

	return (
		<Container
			component="main"
			maxWidth="sm"
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
				<BrowserUpdatedIcon sx={{ fontSize: 70 }} />
				<Typography variant="h2">Update Profile</Typography>
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
						mt: "1rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={updateHandler}
				>
					<Grid container spacing={2}>
						<Grid item md={6}>
							{/* firstName */}
							<TextField
								required
								fullWidth
								id="firstname"
								label="First Name"
								name="firstname"
								margin="normal"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* lastName */}
							<TextField
								required
								fullWidth
								id="lastname"
								label="Last Name"
								name="lastname"
								margin="normal"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* username */}
							<TextField
								required
								fullWidth
								id="username"
								label="Username"
								name="username"
								margin="normal"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</Grid>

						<Grid item md={6}>
							{/* phoneNumber */}
							<TextField
								required
								fullWidth
								error={!isValidPhoneNumber}
								id="phonenumber"
								label={
									!isValidPhoneNumber
										? "Mobile Number Required"
										: "Phone Number"
								}
								name="phonenumber"
								margin="normal"
								helperText={
									!isValidPhoneNumber &&
									"A valid mobile phone number is required in the format of +(country-code) then followed by the number. e.g +254123456789"
								}
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* business name */}
							<TextField
								required
								fullWidth
								id="businessName"
								label="Name of Business"
								name="businessName"
								margin="normal"
								value={businessName}
								onChange={(e) =>
									setBusinessName(e.target.value)
								}
							/>
						</Grid>
						<Grid item md={6}>
							{/* address */}
							<TextField
								required
								fullWidth
								id="address"
								label="Address"
								name="address"
								margin="normal"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* City */}
							<TextField
								fullWidth
								id="city"
								label="City"
								name="city"
								margin="normal"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* Country */}
							<TextField
								fullWidth
								id="country"
								label="Country"
								name="country"
								margin="normal"
								value={country}
								onChange={(e) => setCountry(e.target.value)}
							/>
						</Grid>
					</Grid>
					{/* avatar logo */}
					<TextField
						fullWidth
						id="avatar"
						name="avatar"
						margin="normal"
						value={avatar || ""}
						onChange={(e) => setAvatar(e.target.value)}
					/>
					<label htmlFor="logo">
						<Input
							accept="image/*"
							id="logo"
							name="logo"
							type="file"
							onChange={uploadFileHandler}
						/>
						{!uploading ? (
							<Button
								sx={{ mt: "5px" }}
								variant="contained"
								component="span"
								endIcon={<PhotoCamera />}
							>
								Choose Your Logo
							</Button>
						) : (
							<CircularProgress size={60} />
						)}
					</label>

					<Button
						sx={{ mt: 3, mb: 5 }}
						type="submit"
						fullWidth
						variant="contained"
						color="success"
						size="large"
						endIcon={<CheckIcon />}
					>
						<Typography variant="h5">Update Profile</Typography>
					</Button>
				</Box>
			)}
		</Container>
	);
};

export default EditProfileForm;
