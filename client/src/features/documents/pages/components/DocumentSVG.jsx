import { Container, Grid, Stack, Typography } from "@mui/material";
import DocSVG from "../../../../images/add_bill.svg";

const DocumentSVG = () => {
	return (
		<Container component="main" maxWidth="lg">
			<Grid>
				<Grid item>
					<Stack
						alignItems="center"
						justifyContent="center"
						sx={{ mt: 2 }}
					>
						<Typography variant="h5" sx={{ marginBottom: "10px" }}>
							Sadly, You have no Documents yet. To create on click
							👉 👉 👉
						</Typography>
						<img
							src={DocSVG}
							alt="customer logo"
							className="customer-svg"
						/>
					</Stack>
				</Grid>
			</Grid>
		</Container>
	);
};

export default DocumentSVG;
