import "dotenv/config";
import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";

let transporter;

if (process.env.NODE_ENV === "development") {
	transporter = nodemailer.createTransport({
		host: "mailhog",
		port: 1025,
	});
} else if (process.env.NODE_ENV === "production") {
	const mailgunAuth = {
		auth: {
			api_key: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN,
		},
	};
	transporter = nodemailer.createTransport(mg(mailgunAuth));
}

export default transporter;
