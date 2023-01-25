import { decodeToken } from "react-jwt";
import { useSelector } from "react-redux";
import {
	selectCurrentUserToken,
	selectCurrentUserGoogleToken,
} from "../features/auth/authSlice";

const useAuthUser = () => {
	const token = useSelector(selectCurrentUserToken);
	const googleToken = useSelector(selectCurrentUserGoogleToken);

	let isAdmin = false;

	let accessRight = "User";

	if (token) {
		const decodedToken = decodeToken(token);
		const { roles } = decodedToken;
		isAdmin = roles.includes("Admin");

		if (isAdmin) accessRight = "Admin";

		return { roles, isAdmin, accessRight };
	} else if (googleToken) {
		const gDecodedToken = decodeToken(googleToken);
		const { roles } = gDecodedToken;

		isAdmin = roles.includes("Admin");

		if (isAdmin) accessRight = "Admin";

		return { roles, isAdmin, accessRight };
	}

	return { roles: [], isAdmin, accessRight };
};

export default useAuthUser;
