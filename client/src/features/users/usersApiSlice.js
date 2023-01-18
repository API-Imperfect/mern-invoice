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
	}),
});

export const { useGetAllUsersQuery } = usersApiSlice;
