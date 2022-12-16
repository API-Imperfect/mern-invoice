import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
	Box,
	Button,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	Link,
	OutlinedInput,
	Stack,
	Typography,
} from "@mui/material";
import { Formik } from "formik";
import AuthButtonAnimation from "../../../animations/authButtonAnimations";
import Spinner from "../../../components/Spinner";
import useTitle from "../../../hooks/useTitle";
import { useLoginUserMutation } from "../authApiSlice";
import { logIn } from "../authSlice";

const LoginForm = () => {
	useTitle("Login - MERN Invoice");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const from = location.state?.from?.pathname || "/dashboard";

	const [showPassword, setShowPassword] = useState(false);

	const handleShowHidePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const [loginUser, { data, isLoading, isSuccess }] = useLoginUserMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate(from, { replace: true });
		}
	}, [data, isSuccess, navigate, from]);

	return (
		<>
			<Formik
				initialValues={{
					email: "",
					password: "",
					submit: null,
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email("Must be a valid email")
						.max(255)
						.required("Email is required"),
					password: Yup.string()
						.max(255)
						.required("Password is required"),
				})}
				onSubmit={async (values, { setStatus, setSubmitting }) => {
					try {
						const getUserCredentials = await loginUser(
							values
						).unwrap();
						dispatch(logIn({ ...getUserCredentials }));
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
					<form noValidate autoComplete="off" onSubmit={handleSubmit}>
						{isLoading ? (
							<Spinner />
						) : (
							<Grid container spacing={3}>
								{/* Email */}
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="email-signup">
											Email Address*
										</InputLabel>
										<OutlinedInput
											id="email-signup"
											value={values.email}
											name="email"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="email@example.com"
											inputProps={{}}
											fullWidth
											error={Boolean(
												touched.email && errors.email
											)}
										/>
										{touched.email && errors.email && (
											<FormHelperText
												error
												id="helper-text-email-signup"
											>
												{errors.email}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								{/* password */}
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="password-signup">
											Password
										</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(
												touched.password &&
													errors.password
											)}
											id="password-signup"
											type={
												showPassword
													? "text"
													: "password"
											}
											value={values.password}
											name="password"
											onBlur={handleBlur}
											onChange={(e) => {
												handleChange(e);
											}}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visiblity"
														onClick={
															handleShowHidePassword
														}
														onMouseDown={
															handleMouseDownPassword
														}
														edge="end"
														size="large"
													>
														{showPassword ? (
															<Visibility />
														) : (
															<VisibilityOff />
														)}
													</IconButton>
												</InputAdornment>
											}
											placeholder="******"
											inputProps={{}}
										/>
										{touched.password &&
											errors.password && (
												<FormHelperText
													error
													id="helper-text-password-signup"
												>
													{errors.password}
												</FormHelperText>
											)}
									</Stack>
								</Grid>
								{/* forgot password */}
								<Grid item xs={12}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Typography variant="h6">
											Forgot Password?{" "}
											<Link
												variant="h6"
												component={RouterLink}
												to="/reset_password_request"
												sx={{ textDecoration: "none" }}
											>
												Click Here to Reset it
											</Link>
										</Typography>
									</Box>
								</Grid>
								{/* Login Button */}
								<Grid item xs={12}>
									<AuthButtonAnimation>
										<Button
											disableElevation
											disabled={isSubmitting}
											fullWidth
											size="large"
											type="submit"
											variant="contained"
											color="secondary"
										>
											Login
										</Button>
									</AuthButtonAnimation>
								</Grid>
							</Grid>
						)}
					</form>
				)}
			</Formik>
		</>
	);
};

export default LoginForm;
