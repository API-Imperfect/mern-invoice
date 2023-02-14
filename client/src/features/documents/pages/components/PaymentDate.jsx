import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const PaymentDate = ({ datePaid, setDatePaid }) => {
	const handleChange = (date) => {
		setDatePaid(date.toISOString());
	};
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DesktopDatePicker
				label="Date Paid"
				inputFormat="MM/dd/yyyy"
				value={datePaid}
				onChange={handleChange}
				renderInput={(params) => (
					<TextField
						sx={{ width: "100%" }}
						variant="standard"
						{...params}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};

export default PaymentDate;
