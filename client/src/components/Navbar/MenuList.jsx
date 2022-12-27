import {
	Box,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	styled,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import useAuthUser from "../../hooks/useAuthUser";

const StyledList = styled(List)({
	"&:hover": {
		backgroundColor: "#555a64",
	},
});

const StyledSideMenuDivider = styled(Divider)({
	height: "2px",
	borderColor: "#ffffff63",
});

const MenuList = () => {
	const navigate = useNavigate();

	const { isAdmin } = useAuthUser();

	return (
		<Box>
			<StyledList>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/profile")}>
						<ListItemIcon>
							<ManageAccountsIcon
								sx={{ fontSize: 40 }}
								color="green"
							/>
						</ListItemIcon>
						<ListItemText primary="Manage Profile" />
					</ListItemButton>
				</ListItem>
			</StyledList>
			<StyledSideMenuDivider />

			<StyledList>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/dashboard")}>
						<ListItemIcon>
							<BarChartIcon
								sx={{ fontSize: 40 }}
								color="indigo"
							/>
						</ListItemIcon>
						<ListItemText primary="Dashboard" />
					</ListItemButton>
				</ListItem>
			</StyledList>
			<StyledSideMenuDivider />

			<StyledList>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/documents")}>
						<ListItemIcon>
							<PointOfSaleIcon
								sx={{ fontSize: 40 }}
								color="orange"
							/>
						</ListItemIcon>
						<ListItemText primary="Documents" />
					</ListItemButton>
				</ListItem>
			</StyledList>
			<StyledSideMenuDivider />

			<StyledList>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/customers")}>
						<ListItemIcon>
							<PeopleAltOutlinedIcon
								sx={{ fontSize: 40 }}
								color="blue"
							/>
						</ListItemIcon>
						<ListItemText primary="Customers" />
					</ListItemButton>
				</ListItem>
			</StyledList>
			<StyledSideMenuDivider />

			{isAdmin && (
				<StyledList>
					<ListItem disablePadding>
						<ListItemButton onClick={() => navigate("/users")}>
							<ListItemIcon>
								<AdminPanelSettingsIcon
									sx={{ fontSize: 40 }}
									color="yellow"
								/>
							</ListItemIcon>
							<ListItemText primary="Admin Panel" />
						</ListItemButton>
					</ListItem>
				</StyledList>
			)}
		</Box>
	);
};

export default MenuList;
