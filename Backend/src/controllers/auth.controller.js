import express from "express";
import mongoose from "mongoose";
import { User, Space } from "../models/index.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { generatePassword } from "../utils/generate-pass.utils.js";
import { sendMail } from "../utils/email-verification.js";
import path from "path";
import { ValidationError, ConflictError, NotFoundError, ForbiddenError, InternalServerError } from "../utils/customErrors.js";


const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (!user) {
        return res.status(404).json({
          error: { message: info.message },
        });
      }

      if (err) {
        throw new Error(err);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // Content in jwt token
        const body = {
          _id: user._id,
          username: user.username,
          email: user.email,
          serversJoined: user.serversJoined,
        };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        return res.status(200).json({ token });
      });
    } catch (error) {
      return res.status(400).json({
        error: {
          message: error.message,
        },
      });
    }
  })(req, res, next);
};

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const interests = req.body.interests || [];
  const avatar = req.file
    ? {
        name: req.fileoriginalname,
        size: req.filesize,
        type: req.filemimetype,
        source: req.file.path.split(path.sep).join('/'),
      }
    : null;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        message: "email and password  are required",
      },
    });
  }
  try {

    const emailExist = await User.findOne({
      email: email,
    }).collation({ locale: "en", strength: 2 });

    if (emailExist) {
      return res.status(400).json({
        error: { message: " Email already exists. Please use a different email address" },
      });
    }

    const passwordHash = await generatePassword(password);
    const user = await User.create({
      email,
      password: passwordHash,
    });
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    }); 
  }
}

const preSignUp = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			error: {
				message: "email and password  are required",
			},
		});
	}
	try {
		const emailExist = await User.findOne({
			email: email,
		}).collation({ locale: "en", strength: 2 });

		if (emailExist) {
			return res.status(400).json({
				error: {
					message:
						" Email already exists. Please use a different email address",
				},
			});
		}

		// const passwordHash = await generatePassword(password);
		// const user = await User.create({
		//   email,
		//   password: passwordHash,
		// });
		const token = jwt.sign(
			{ email: email, password: password },
			process.env.JWT_SECRET
		);

    try {
      sendMail(email, token, "GENERAL");
    } catch(error) {
      return res.status(500).json({
        error: { message: error.message },
      });
    }


		return res.status(200).json({
			message: "Verification email sent successfully",
		});
	} catch (error) {
		return res.status(500).json({
			error: { message: error.message },
		});
	}
};

const verifyEmail = async (req, res) => {
	const { token } = req.params;
	const { type } = req.query;

	if (!token || !type) {
		return res.status(400).json({
			error: {
				message: "Token and type are required",
			},
		});
	}

	const { email, password } = jwt.verify(token, process.env.JWT_SECRET);

	if (!email || (type.toLowerCase() === "general" && !password)) {
		return res.status(400).json({
			error: {
				message: "Invalid token",
			},
		});
	}
  if(type.toLowerCase() === "resetpassword"){

    const existingUser = await User.findOne({email: email});

    const token = jwt.sign({ user: existingUser }, process.env.JWT_SECRET);

			// redirect to some frontend page
			return res.redirect(
				`${process.env.FRONTEND_URL}/reset-password?token=${token}&userId=${existingUser._id}`
      )
  }

	if (type.toLowerCase() === "general") {
		try {
			const emailExist = await User.findOne({
				email: email,
			}).collation({ locale: "en", strength: 2 });

			if (emailExist) {
				return res.status(400).json({
					error: {
						message:
							" Email already exists. Please use a different email address",
					},
				});
			}

			const passwordHash = await generatePassword(password);
      const botSpace = await Space.create({name: email, type: "BOT", description: `This is LLM bot convo Space for user ${email}`});
			const user = await User.create({
				email,
				password: passwordHash,
        verified: true,
        botSpace: botSpace._id
			});

			const token = jwt.sign({ user: user }, process.env.JWT_SECRET);

			// redirect to some frontend page
			return res.redirect(
				`${process.env.FRONTEND_URL}/onboarding?token=${token}&userId=${user._id}`
			);
		} catch (error) {
			return res.status(500).json({
				error: { message: error.message },
			});
		}
	} else if (type.toLowerCase() === "educational") {
		try {
			const user = await User.findOne({
				educationalDetails: { educationalEmail: email },
			}).collation({ locale: "en", strength: 2 });

			user.educationalDetails = {
				educationalEmail: email,
				verified: true,
			};

			await user.save();

			return res.redirect(`${process.env.FRONTEND_URL}/servers`);
		} catch (error) {
			return res.status(500).json({
				error: { message: error.message },
			});
		}
	}
};


//it is depricated 
const updateUser = async (req, res) => {
  const { id } = req.params;
  let interests = req.body.interests || [];
  const { educationalEmail } = req.body || {};
  const avatar = req.file
    ? {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        source: req.file.path.split(path.sep).join('/'),
      }
    : null;

  if (id !== req.user.user._id.toString()) {
    return res.status(403).json({
      error: {
        message: "Forbidden",
      },
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: {
        message: "Invalid user id",
      },
    });
  }

  if (typeof interests === "string") {
    interests = JSON.parse(interests);
  }

  if (educationalEmail) {
    const token = jwt.sign(
      { email: educationalEmail },
      process.env.JWT_SECRET
    );

    try {
      sendMail(educationalEmail, token, "EDUCATIONAL");
    } catch (error) {
      return res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }

  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { interests: interests, avatar: avatar},
      { new: true }
    ).populate("interests");

    if (!user) {
      return res.status(404).json({
        error: {
          message: "User not found",
        },
      });
    }
    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    data: req.user,
  });
};

const sendPasswordResetLink = async (req, res) => {
  const { email } = req.body;


  try {
    const userExist = await User.findOne({email: email});
  console.log("user ", userExist)
  if (!userExist){
    return res.status(404).json({
      error: {
        message: "User with this email not found",
      },
    });
  } 

  const token = jwt.sign(
    { email: email, password: userExist.password},
    process.env.JWT_SECRET
  );

  try {
    sendMail(email, token, "RESETPASSWORD");
  } catch(error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }


  return res.status(200).json({
    message: "Reset Password email sent successfully",
  });

  } catch (error) {
    
  }

}






export default {
  login,
  signUp,
  getProfile,
  updateUser,
  verifyEmail,
  preSignUp,
  sendPasswordResetLink,
};
