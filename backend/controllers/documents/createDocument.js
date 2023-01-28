import asyncHandler from "express-async-handler";
import Customer from "../../models/customerModel.js";
import Document from "../../models/documentModel.js";

// $-title   Create Document
// $-path    POST /api/v1/document/create
// $-auth    Private

const createDocument = asyncHandler(async (req, res) => {
	const customer = await Customer.findOne({ createdBy: req.user._id });

	if (!customer) {
		res.status(404);
		throw new Error(
			"That customer does not exist for the currently logged in user"
		);
	}

	if (customer.createdBy.toString() !== req.user._id.toString()) {
		res.status(400);
		throw new Error(
			"You are not allowed to create documents for customers who you did not create"
		);
	}

	const fieldsToCreate = req.body;

	const newDocument = new Document({
		createdBy: req.user._id,
		...fieldsToCreate,
	});

	const createdDocument = await newDocument.save();

	if (!createdDocument) {
		res.status(400);
		throw new Error("The document could not be created");
	}

	res.status(200).json({
		success: true,
		newDocument,
	});
});

export default createDocument;
