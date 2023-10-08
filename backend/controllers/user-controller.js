import User from "../model/User";

export const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        const error = new Error("Fetching users failed, please try again later.");
        return next(error);
    }
    if(!users){
        return res.status(404).json({message: "Could not find any users."});
    }
    return res.status(200).json({users});
}