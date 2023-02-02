import { baseApiSlice } from "../api/baseApiSlice";

export const usersApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAllUsers: builder.query({
			query: () => ({
				url: "/user/all",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			providesTags: (result) =>
				result
					? [
							...result.users.map(({ id }) => ({
								type: "User",
								id,
							})),
							{ type: "User", id: "LIST" },
					  ]
					: [{ type: "User", id: "LIST" }],
		}),
		getUserProfile: builder.query({
			query: () => "/user/profile",
			providesTags: [{ type: "User", id: "SINGLE_USER" }],
		}),
		updateUserProfile: builder.mutation({
			query: (profileData) => ({
				url: "/user/profile",
				method: "PATCH",
				body: profileData,
			}),
			invalidatesTags: [{ type: "User", id: "SINGLE_USER" }],
		}),
		deleteMyAccount: builder.mutation({
			query: () => ({
				url: "user/profile",
				method: "DELETE",
			}),
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
		deleteUser: builder.mutation({
			query: (id) => ({
				url: `/user/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
		deactivateUser: builder.mutation({
			query: (id) => ({
				url: `/user/${id}/deactivate`,
				method: "PATCH",
			}),
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
	}),
});

export const {
	useGetAllUsersQuery,
	useUpdateUserProfileMutation,
	useGetUserProfileQuery,
	useDeleteMyAccountMutation,
	useDeleteUserMutation,
	useDeactivateUserMutation,
} = usersApiSlice;
