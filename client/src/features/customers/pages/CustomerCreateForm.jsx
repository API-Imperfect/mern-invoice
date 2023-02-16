import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {
	Button,
	Container,
	FormHelperText,
	Grid,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import useTitle from "../../../hooks/useTitle";
import { useCreateCustomerMutation } from "../customersApiSlice";

const CustomerCreateForm = () => {
	useTitle("Create Customer - MERN Invoice");

	const navigate = useNavigate();
	const location = useLocation();
	const goBack = () => navigate(-1);

	const from = location.state?.from?.pathname || "/customers";

	const [createCustomer, { isSuccess, isLoading }] =
		useCreateCustomerMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate(from, { replace: true });
		}
	}, [isSuccess, navigate, from]);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
					email: "",
					phoneNumber: "",
					vatTinNo: 0,
					address: "",
					city: "",
					country: "",
				}}
				validationSchema={Yup.object().shape({
					name: Yup.string()
						.max(255)
						.required("A customer must have a name"),
					email: Yup.string()
						.email("Must be a valid email")
						.max(255)
						.required("Email is required"),
					phoneNumber: Yup.string()
						.max(20)
						.required(
							"Your mobile phone number must begin with a '+', followed by your country code then actual number e.g +254123456789"
						),
				})}
				onSubmit={async (values, { setStatus, setSubmitting }) => {
					try {
						await createCustomer(values).unwrap();
						setStatus({ success: true });
						setSubmitting(false);
					} catch (err) {
						const message = err.data.message;
						toast.error(message);
						setStatus({ success: false });
						setSubmitting(false);
					}
				}}
			>
				{({
					errors,
					handleBlur,
					handleChange,
					handleSubmit,
					isSubmitting,
					touched,
					values,
				}) => (
					<>
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
							<form
								noValidate
								autoComplete="off"
								onSubmit={handleSubmit}
							>
								<Grid>
									<Grid item xs={12}>
										<Stack
											direction="row"
											justifyContent="center"
											alignItems="center"
										>
											<Stack
												direction="row"
												alignItems="center"
											>
												<SaveAsIcon
													sx={{ fontSize: 60 }}
												/>
												<Typography variant="h3">
													Create Customer
												</Typography>
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
										<Grid container>
											<Grid item xs={12}>
												<Stack spacing={1}>
													<InputLabel htmlFor="customer-name">
														Customer name*
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.name &&
																errors.name
														)}
														id="customer-name"
														type="name"
														value={values.name}
														name="name"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="John Smith"
														inputProps={{}}
													/>
													{touched.name &&
														errors.name && (
															<FormHelperText
																error
																id="helper-text-customer-name"
															>
																{errors.name}
															</FormHelperText>
														)}
													{/* email address */}
													<InputLabel htmlFor="email-signup">
														Email Address*
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.email &&
																errors.email
														)}
														id="email-signup"
														type="email"
														value={values.email}
														name="email"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="email@example.com"
														inputProps={{}}
													/>
													{touched.email &&
														errors.email && (
															<FormHelperText
																error
																id="helper-text-email-signup"
															>
																{errors.email}
															</FormHelperText>
														)}
													{/* phone number */}
													<InputLabel htmlFor="customer-phoneNumber">
														Mobile Phone Number*
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.phoneNumber &&
																errors.phoneNumber
														)}
														id="customer-phoneNumber"
														type="phoneNumber"
														value={
															values.phoneNumber
														}
														name="phoneNumber"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="e.g +254710123456 - must be a valid mobile phone number with country code."
														inputProps={{}}
													/>
													{touched.phoneNumber &&
														errors.phoneNumber && (
															<FormHelperText
																error
																id="helper-text-customer-phoneNumber"
															>
																{
																	errors.phoneNumber
																}
															</FormHelperText>
														)}
													{/* VatTinNo */}
													<InputLabel htmlFor="customer-vatTin">
														VAT/TIN No*
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.vatTinNo &&
																errors.vatTinNo
														)}
														id="customer-vatTin"
														type="vatTinNo"
														value={values.vatTinNo}
														name="vatTinNo"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="e.g +254710123456 - must be a valid phone number with country code."
														inputProps={{}}
													/>
													{touched.vatTinNo &&
														errors.vatTinNo && (
															<FormHelperText
																error
																id="helper-text-vatTinNo"
															>
																{
																	errors.vatTinNo
																}
															</FormHelperText>
														)}

													{/* Address */}
													<InputLabel htmlFor="customer-address">
														Address
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.address &&
																errors.address
														)}
														id="customer-address"
														type="address"
														value={values.address}
														name="address"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="101 James Doolittle Blvd"
														inputProps={{}}
													/>
													{touched.address &&
														errors.address && (
															<FormHelperText
																error
																id="helper-text-address"
															>
																{errors.address}
															</FormHelperText>
														)}
													{/* City */}
													<InputLabel htmlFor="customer-city">
														City
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.city &&
																errors.city
														)}
														id="customer-city"
														type="city"
														value={values.city}
														name="city"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="e.g Nairobi"
														inputProps={{}}
													/>
													{touched.city &&
														errors.city && (
															<FormHelperText
																error
																id="helper-text-vatTinNo"
															>
																{errors.city}
															</FormHelperText>
														)}
													{/* Country */}
													<InputLabel htmlFor="customer-country">
														Country
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.country &&
																errors.country
														)}
														id="customer-country"
														type="country"
														value={values.country}
														name="country"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="e.g Nairobi"
														inputProps={{}}
													/>
													{touched.country &&
														errors.country && (
															<FormHelperText
																error
																id="helper-text-vatTinNo"
															>
																{errors.country}
															</FormHelperText>
														)}
													{/* button */}
													<Grid item xs={12}>
														<Button
															sx={{
																mt: 3,
																mb: 2,
															}}
															type="submit"
															fullWidth
															variant="contained"
															color="success"
															size="large"
															endIcon={
																<PersonAddAlt1Icon fontSize="large" />
															}
															disabled={
																!values.email ||
																!values.phoneNumber ||
																!values.name
															}
														>
															Create Customer
														</Button>
													</Grid>
												</Stack>
											</Grid>
										</Grid>
									)}
								</Grid>
							</form>
						</Container>
					</>
				)}
			</Formik>
		</>
	);
};

export default CustomerCreateForm;
