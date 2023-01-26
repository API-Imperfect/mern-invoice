import asyncHandler from "express-async-handler";
import Customer from "../../models/customerModel.js";

// $-title   Get a Single customer belonging to a User
// $-path    GET /api/v1/customer/:id
// $-auth    Private

const getSingleUserCustomer = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	const user = req.user._id;

	if (!customer) {
		res.status(204);
		throw new Error("Customer not found");
	}

	if (customer.id !== user) {
		res.status(200).json({
			success: true,
			customer,
		});
	} else {
		res.status(401);
		throw new Error(
			"You are not authorized to view this customer's information. He/She is not your customer"
		);
	}
});

export default getSingleUserCustomer;
