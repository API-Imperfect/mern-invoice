import pdf from "html-pdf";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../../helpers/emailTransport.js";
import emailTemplate from "../../utils/pdf/emailTemplate.js";
import options from "../../utils/pdf/options.js";
import pdfTemplate from "../../utils/pdf/pdfTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "../../../docs/myDocument.pdf");

// $-title   Generate document
// $-path    POST /api/v1/document/generate-pdf
// $-auth    Public
export const generatePDF = async (req, res) => {
	pdf.create(pdfTemplate(req.body), options).toFile(
		"myDocument.pdf",
		(err) => {
			if (err) {
				res.send(Promise.reject());
			}
			res.send(Promise.resolve());
		}
	);
};

// $-title   Generate document
// $-path    GET /api/v1/document/get-pdf
// $-auth    Public
export const getPDF = (req, res) => {
	res.sendFile(filepath);
};

// $-title   send document as email
// $-path    POST /api/v1/document/send-document
// $-auth    Public

export const sendDocument = (req, res) => {
	const { profile, document } = req.body;

	pdf.create(pdfTemplate(req.body), options).toFile(filepath, (err) => {
		transporter.sendMail({
			from: process.env.SENDER_EMAIL,
			to: `${document.customer.email}`,
			replyTo: `${profile.email}`,
			subject: `Document from ${
				profile.businessName ? profile.businessName : profile.firstName
			}`,
			text: `Document from ${
				profile.businessName ? profile.businessName : profile.firstName
			}`,
			html: emailTemplate(req.body),
			attachments: [
				{
					filename: "myDocument.pdf",
					path: filepath,
				},
			],
		});

		if (err) {
			res.send(Promise.reject());
		}
		res.send(Promise.resolve());
	});
};
