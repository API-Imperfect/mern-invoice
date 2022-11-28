import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// $-title   Delete My Account
// $-path    DELETE /api/v1/user/profile
// $-auth    Private
const deleteMyAccount = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	await User.findByIdAndDelete(userId);

	res.json({ success: true, message: "Your user account has been deleted" });
});

export default deleteMyAccount;
