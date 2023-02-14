import { baseApiSlice } from "../api/baseApiSlice";

export const documentsApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAllMyDocs: builder.query({
			query: (page = 1) => `/document/all?page=${page}`,
			providesTags: ["Document"],
		}),
		getSingleDoc: builder.query({
			query: (id) => `/document/${id}`,
			providesTags: ["Document"],
		}),
		createDoc: builder.mutation({
			query: (formData) => ({
				url: "/document/create",
				method: "POST",
				body: formData,
			}),
			invalidatesTags: ["Document"],
		}),
		updateDoc: builder.mutation({
			query: ({ id, ...rest }) => ({
				url: `/document/${id}`,
				method: "PATCH",
				body: rest,
			}),
			invalidatesTags: ["Document"],
		}),
		deleteDoc: builder.mutation({
			query: (id) => ({
				url: `/document/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Document"],
		}),
		createPayment: builder.mutation({
			query: ({ id, ...rest }) => ({
				url: `/document/${id}/payment`,
				method: "POST",
				body: rest,
			}),
			invalidatesTags: ["Document"],
		}),
	}),
});

export const {
	useCreatePaymentMutation,
	useDeleteDocMutation,
	useCreateDocMutation,
	useGetSingleDocQuery,
	useGetAllMyDocsQuery,
	useUpdateDocMutation,
} = documentsApiSlice;
