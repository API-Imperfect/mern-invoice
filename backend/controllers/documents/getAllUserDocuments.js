import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";

// $-title   Get all documents belonging to a specific User
// $-path    GET /api/v1/document/all
// $-auth    Private

const getAllUserDocuments = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.page) || 1;

	const count = await Document.countDocuments({ createdBy: req.user._id });

	const documents = await Document.find({ createdBy: req.user._id })
		.sort({
			createdAt: -1,
		})
		.limit(pageSize)
		.skip(pageSize * (page - 1))
		.lean();

	res.json({
		success: true,
		totalDocuments: count,
		numberOfPages: Math.ceil(count / pageSize),
		myDocuments: documents,
	});
});

export default getAllUserDocuments;
