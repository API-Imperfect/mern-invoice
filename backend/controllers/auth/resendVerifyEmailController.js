import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";
const domainURL = process.env.DOMAIN;
const { randomBytes } = await import("crypto");

// $-title   Resend Email Verification Tokens
// $-path    POST /api/v1/auth/resend_email_token
// $-auth    Public

const resendEmailVerificationToken = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!email) {
		res.status(400);
		throw new Error("An email must be provided");
	}

	if (!user) {
		res.status(400);
		throw new Error(
			"We were unable to find a user with that email address"
		);
	}

	if (user.isEmailVerified) {
		res.status(400);
		throw new Error("This account has already been verified. Please login");
	}

	let verificationToken = await VerificationToken.findOne({
		_userId: user._id,
	});

	if (verificationToken) {
		await VerificationToken.deleteOne();
	}

	const resentToken = randomBytes(32).toString("hex");

	let emailToken = await new VerificationToken({
		_userId: user._id,
		token: resentToken,
	}).save();

	const emailLink = `${domainURL}/api/v1/auth/verify/${emailToken.token}/${user._id}`;

	const payload = {
		name: user.firstName,
		link: emailLink,
	};

	await sendEmail(
		user.email,
		"Account Verification",
		payload,
		"./emails/template/accountVerification.handlebars"
	);

	res.json({
		success: true,
		message: `${user.firstName}, an email has been sent to your account, please verify within 15 minutes`,
	});
});

export default resendEmailVerificationToken;
