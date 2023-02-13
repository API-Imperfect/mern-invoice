import { baseApiSlice } from "../api/baseApiSlice";

export const customersApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAllUserCustomers: builder.query({
			query: (page = 1) => `/customer/all?page=${page}`,
			providesTags: ["Customer"],
		}),
		createCustomer: builder.mutation({
			query: (customerInfo) => ({
				url: "/customer/create",
				method: "POST",
				body: customerInfo,
			}),
			invalidatesTags: ["Customer"],
		}),
		getSingleCustomer: builder.query({
			query: (custId) => `/customer/${custId}`,
			providesTags: ["Customer"],
		}),
		updateCustomerInfo: builder.mutation({
			query: ({ id, ...otherFields }) => ({
				url: `/customer/${id}`,
				method: "PATCH",
				body: otherFields,
			}),
			invalidatesTags: ["Customer"],
		}),
		deleteCustomer: builder.mutation({
			query: (id) => ({
				url: `/customer/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Customer"],
		}),
	}),
});

export const {
	useGetAllUserCustomersQuery,
	useGetSingleCustomerQuery,
	useCreateCustomerMutation,
	useUpdateCustomerInfoMutation,
	useDeleteCustomerMutation,
} = customersApiSlice;
