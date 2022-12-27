import { baseApiSlice } from "../api/baseApiSlice";
import { logOut } from "./authSlice";

export const authApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		registerUser: builder.mutation({
			query: (userData) => ({
				url: "/auth/register",
				method: "POST",
				body: userData,
			}),
		}),
		loginUser: builder.mutation({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
			}),
		}),
		logoutUser: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "GET",
			}),

			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					dispatch(logOut());
					dispatch(baseApiSlice.util.resetApiState());
				} catch (err) {
					console.log(err);
				}
			},
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useLoginUserMutation,
	useLogoutUserMutation,
} = authApiSlice;
