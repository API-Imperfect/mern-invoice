import { createSlice } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";

const user = JSON.parse(localStorage.getItem("user"));
const googleToken = localStorage.getItem("googleToken");

const decodedToken = decodeToken(googleToken);

const initialState = {
	user: user ? user : decodedToken,
	googleToken: googleToken ? googleToken : null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logIn: (state, action) => {
			state.user = action.payload;
			localStorage.setItem("user", JSON.stringify(action.payload));
		},
		logOut: (state, action) => {
			state.user = null;
			state.googleToken = null;
			localStorage.removeItem("user");
			localStorage.removeItem("googleToken");
		},
	},
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUserToken = (state) => state.auth.user?.accessToken;

export const selectCurrentUserGoogleToken = (state) => state.auth?.googleToken;
