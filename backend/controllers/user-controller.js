import User from "../model/User";
import bcrypt from "bcryptjs";

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

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    }catch (err) {
        return console.log(err);
    } 
    if (existingUser) {
        return res.status(422).json({message: "User exists already, please login instead."});
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    });

    

    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }
    return res.status(201).json({user});
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    }catch (err) {
        return console.log(err);
    } 
    if (!existingUser) {
        return res.status(404).json({message: "User does not exist."});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect){
        return res.status(401).json({message: "Invalid credentials, could not log you in."});
    }
    return res.status(200).json({message: "Logged in!"});
}