import asyncHandler from "express-async-handler";
import Customer from "../../models/customerModel.js";

// $-title   Update Customer
// $-path    PATCH /api/v1/customer/:id
// $-auth    Private

const updateCustomerInfo = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	if (!customer) {
		res.status(404);
		throw new Error("That Customer does not exist");
	}

	if (customer.createdBy.toString() !== req.user.id) {
		res.status(401);
		throw new Error(
			"You are not authorized to update this customer's information. He/She is not your customer"
		);
	}

	const { id: _id } = req.params;
	const fieldsToUpdate = req.body;

	const updatedCustomerInfo = await Customer.findByIdAndUpdate(
		_id,
		{ ...fieldsToUpdate, _id },
		{ new: true, runValidators: true }
	);

	res.status(200).json({
		success: true,
		message: `${customer.name}'s info was successfully updated`,
		updatedCustomerInfo,
	});
});

export default updateCustomerInfo;
