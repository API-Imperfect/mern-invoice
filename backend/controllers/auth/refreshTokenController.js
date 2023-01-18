import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

// $-title   Get new access tokens from the refresh token
// $-path    GET /api/v1/auth/new_access_token
// $-auth    Public
// we are rotating the refresh tokens, deleting the old ones, creating new ones and detecting token reuse

const newAccessToken = asyncHandler(async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		return res.sendStatus(401);
	}

	const refreshToken = cookies.jwt;

	const options = {
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
		secure: true,
		sameSite: "None",
	};
	res.clearCookie("jwt", options);

	const existingUser = await User.findOne({ refreshToken }).exec();

	if (!existingUser) {
		jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET_KEY,
			async (err, decoded) => {
				if (err) {
					return res.sendStatus(403);
				}
				const hackedUser = await User.findOne({
					_id: decoded.id,
				}).exec();
				hackedUser.refreshToken = [];
				await hackedUser.save();
			}
		);
		return res.sendStatus(403);
	}

	const newRefreshTokenArray = existingUser.refreshToken.filter(
		(refT) => refT !== refreshToken
	);

	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET_KEY,
		async (err, decoded) => {
			if (err) {
				existingUser.refreshToken = [...newRefreshTokenArray];
				await existingUser.save();
			}

			if (err || existingUser._id.toString() !== decoded.id) {
				return res.sendStatus(403);
			}

			const accessToken = jwt.sign(
				{
					id: existingUser._id,
					roles: existingUser.roles,
				},
				process.env.JWT_ACCESS_SECRET_KEY,
				{ expiresIn: "10m" }
			);

			const newRefreshToken = jwt.sign(
				{ id: existingUser._id },
				process.env.JWT_REFRESH_SECRET_KEY,
				{ expiresIn: "1d" }
			);

			existingUser.refreshToken = [
				...newRefreshTokenArray,
				newRefreshToken,
			];
			await existingUser.save();

			const options = {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
				secure: true,
				sameSite: "None",
			};

			res.cookie("jwt", newRefreshToken, options);

			res.json({
				success: true,
				firstName: existingUser.firstName,
				lastName: existingUser.lastName,
				username: existingUser.username,
				provider: existingUser.provider,
				avatar: existingUser.avatar,
				accessToken,
			});
		}
	);
});

export default newAccessToken;
