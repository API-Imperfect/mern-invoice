import CheckIcon from "@mui/icons-material/Check";
import {
	Box,
	Button,
	Container,
	CssBaseline,
	Grid,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import {
	useGetSingleCustomerQuery,
	useUpdateCustomerInfoMutation,
} from "../customersApiSlice";

const CustomerEditForm = () => {
	const { custId } = useParams();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [vatTinNo, setVatTinNo] = useState(0);
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");

	const navigate = useNavigate();
	// -1 means go back to the previous page where you came from
	const goBack = () => navigate(-1);

	const { data } = useGetSingleCustomerQuery(custId);

	const [updateCustomerInfo, { isLoading, isSuccess, data: updateData }] =
		useUpdateCustomerInfoMutation();

	useEffect(() => {
		const customer = data?.customer;
		if (customer) {
			setName(customer.name);
			setEmail(customer.email);
			setPhoneNumber(customer.phoneNumber);
			setVatTinNo(customer.vatTinNo);
			setAddress(customer.address);
			setCity(customer.city);
			setCountry(customer.country);
		}
	}, [data]);

	useEffect(() => {
		if (isSuccess) {
			navigate("/customers");
			const message = updateData?.message;
			toast.success(message);
		}
	}, [isSuccess, navigate, updateData]);

	const updateHandler = async (e) => {
		e.preventDefault();

		try {
			const userData = {
				name,
				email,
				phoneNumber,
				vatTinNo,
				address,
				city,
				country,
			};
			await updateCustomerInfo({
				id: data?.customer._id,
				...userData,
			}).unwrap();
		} catch (err) {
			console.error(err);
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

			<Grid item xs={12}>
				<Stack
					direction="row"
					justifyContent="center"
					alignItems="center"
				>
					<Stack direction="row" alignItems="center">
						<GrDocumentUpdate fontSize="40px" />
						<Typography variant="h3">Edit Customer Info</Typography>
					</Stack>
					<Button
						variant="contained"
						color="warning"
						size="small"
						sx={{
							fontSize: "1rem",
							ml: "10px",
						}}
						onClick={goBack}
					>
						Go Back
					</Button>
				</Stack>
				<StyledDivider />
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
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={updateHandler}
				>
					<Grid container spacing={2}>
						<Grid item md={6}>
							{/* customer name */}
							<TextField
								required
								fullWidth
								id="name"
								label="Customer Full Name"
								name="name"
								margin="normal"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* customer Email */}
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								margin="normal"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* Phone Number */}
							<TextField
								required
								fullWidth
								id="phoneNumber"
								label="Phone Number"
								name="phoneNumber"
								margin="normal"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* VAT/TIN Number */}
							<TextField
								fullWidth
								id="vatTinNo"
								label="VAT/TIN Number"
								name="vatTinNo"
								margin="normal"
								value={vatTinNo}
								onChange={(e) => setVatTinNo(e.target.value)}
							/>
						</Grid>
						<Grid item md={6}>
							{/* Address */}
							<TextField
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
					</Grid>
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
					<Button
						sx={{ mt: 3, mb: 15 }}
						type="submit"
						fullWidth
						variant="contained"
						color="success"
						size="large"
						endIcon={<CheckIcon />}
					>
						<Typography variant="h5">Update Customer</Typography>
					</Button>
				</Box>
			)}
		</Container>
	);
};

export default CustomerEditForm;
