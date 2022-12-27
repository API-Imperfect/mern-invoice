import { decodeToken } from "react-jwt";
import { useSelector } from "react-redux";
import { selectCurrentUserToken } from "../features/auth/authSlice";

const useAuthUser = () => {
	const token = useSelector(selectCurrentUserToken);
	let isAdmin = false;

	let accessRight = "User";

	if (token) {
		const decodedToken = decodeToken(token);
		const { roles } = decodedToken;

		isAdmin = roles.includes("Admin");

		if (isAdmin) accessRight = "Admin";
		return { roles, isAdmin, accessRight };
	}
	return { roles: [], isAdmin, accessRight };
};

export default useAuthUser;
