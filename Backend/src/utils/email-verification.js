import nodeMailer from "nodemailer";
import "dotenv/config";

import { YurtVerifyEdu, YurtVerifyNormal, YurtResetPassword } from "../email/index.js";

const transporter = nodeMailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export const sendMail = (sendTo, token, type) => {

	const verifyLink = `${process.env.BACKEND_URL}/auth/verify/${token}?type=${type.toLowerCase()}`;
    let subject = "";
	let emailTemplate = "";

    if (type === "EDUCATIONAL") {
        subject = "Yurt Educational Email Verification";
		emailTemplate = YurtVerifyEdu(verifyLink);
        
    } else if (type === "GENERAL") {
        subject = "Yurt Email Verification"
		emailTemplate = YurtVerifyNormal(verifyLink);
	
    } else if(type === "RESETPASSWORD") {
		subject = "Yurt Reset Password"
		emailTemplate = YurtResetPassword(verifyLink);
	}else {
        // throw an exception
        throw new Error("Invalid Email Type");
    }

	const mailConfigurations = {

		from: process.env.SMTP_FROM_EMAIL,
		to: sendTo,

		subject: subject,
		html: emailTemplate,
	};


    console.log({
		...mailConfigurations,
		html: "Email Template is too long to display",
	});
	console.log("Verify Link: ", verifyLink);


	transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
			console.log("Error in sending email:", error.response);
		} else {
			console.log("Email Sent Successfully");
			console.log(info);
		}
    });
    
};

