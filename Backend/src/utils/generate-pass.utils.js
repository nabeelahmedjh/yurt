import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
export const generatePassword = async (password) => {

    try {
        const salt = await bcrypt.genSalt(process.env.SALTROUNDS || 10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
        throw new Error({
            message: "Internal Server Error",
            status: 500
        });
    }
}