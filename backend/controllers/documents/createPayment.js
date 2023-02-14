import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";

// $-title   Create new payment
// $-path    POST /api/v1/document/:id/payment
// $-auth    Private

const createDocumentPayment = asyncHandler(async (req, res) => {
	const document = await Document.findById(req.params.id);

	const { datePaid, amountPaid, paymentMethod, additionalInfo } = req.body;

	const payment = {
		paidBy: document.customer.name,
		datePaid,
		amountPaid,
		paymentMethod,
		additionalInfo,
	};
	document.paymentRecords.push(payment);

	await document.save();

	res.status(201).json({
		success: true,
		message: "Payment has been recorded successfully",
	});
});

export default createDocumentPayment;
