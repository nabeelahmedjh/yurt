import { usersService} from "../services/index.js";


const getAllUsers = async (req, res) => {

    const username = req.query.username ?? "";
    const searchType = req.query.searchType ?? "";


    try {
        const users = await usersService.getAllUsers(username, searchType)
        
        if (Array.isArray(users) && users.length === 0) {
            return res.status(404).json({
                error: { message: "No users found" },
            });
        }

        return res.status(200).json({
            data: users,
        });
        
        
    } catch (error) {
        return res.status(500).json({
			error: { message: error.message },
		});
    }
}


export default{
    getAllUsers
};