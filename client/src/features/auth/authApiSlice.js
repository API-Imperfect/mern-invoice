import { baseApiSlice } from "../api/baseApiSlice";

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
	}),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApiSlice;
