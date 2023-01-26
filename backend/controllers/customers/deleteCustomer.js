import asyncHandler from "express-async-handler";
import Customer from "../../models/customerModel.js";

// $-title   Delete Customer
// $-path    DELETE /api/v1/customer/:id
// $-auth    Private

const deleteCustomer = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	if (!customer) {
		res.status(404);
		throw new Error("That customer does not exist!");
	}

	if (customer.createdBy.toString() !== req.user.id) {
		res.status(401);
		throw new Error(
			"You are not authorized to delete this customer's information. He/She is not your customer!"
		);
	}

	await customer.delete();

	res.json({ success: true, message: "Your customer has been deleted" });
});

export default deleteCustomer;
