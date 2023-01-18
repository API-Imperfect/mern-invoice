import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

const AuthRequired = ({ allowedRoles }) => {
	const location = useLocation();

	const { roles } = useAuthUser();

	return roles.some((role) => allowedRoles.includes(role)) ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default AuthRequired;
