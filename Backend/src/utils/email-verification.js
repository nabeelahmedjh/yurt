import nodeMailer from "nodemailer";
import "dotenv/config";

const transporter = nodeMailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export const sendMail = (sendTo, token, type) => {

    let subject = "";

    if (type === "EDUCATIONAL") {
        subject = "Yurt Educational Email Verification";
        
    } else if (type === "GENERAL") {
        subject = "Yurt Email Verification"
    } else {
        // throw an exception
        throw new Error("Invalid Email Type");
    }

	const mailConfigurations = {
		// It should be a string of sender/server email
		from: process.env.SMTP_FROM_EMAIL,

		to: sendTo,
		// Subject of Email
		subject: subject,

		// This would be the text of email body
		text: `Hi there, you have recently entered your
		email on our website.

		Please follow the given link to verify your email
        ${process.env.BACKEND_URL}/auth/verify/${token}?type=${type.toLowerCase()} 

		Thanks`
	};
    console.log(mailConfigurations);

	transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
			console.log("Error in sending email:", error.response);
		} else {
			console.log("Email Sent Successfully");
			console.log(info);
		}
    });
    
};

