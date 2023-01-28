import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";

// $-title   Delete Document
// $-path    DELETE /api/v1/document/:id
// $-auth    Private

const deleteDocument = asyncHandler(async (req, res) => {
	const document = await Document.findById(req.params.id);

	if (!document) {
		res.status(404);
		throw new Error("That document does not exist!");
	}

	if (document.createdBy.toString() !== req.user.id) {
		res.status(401);
		throw new Error(
			"You are not authorized to delete this document. It's not yours"
		);
	}

	await document.delete();

	res.json({ success: true, message: "Your document has been deleted" });
});

export default deleteDocument;
