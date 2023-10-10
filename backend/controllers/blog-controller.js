import Blog from "../model/Blog";
import User from "../model/User";
import mongoose from "mongoose";
export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try{
        blogs = await Blog.find({});
    } catch (err) {
        const error = new Error("Fetching blogs failed, please try again later.");
        return next(error);
    }
    if(!blogs){
        return res.status(404).json({message: "Could not find any blogs."});
    }
    return res.status(200).json({blogs});
}

export const addBlog = async (req, res, next) => {
    const {title, description, image, user} = req.body;
    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        const error = new Error("Creating blog failed, please try again later.");
        return next(error);
    }
    if(!existingUser){
        return res.status(404).json({message: "Could not find any user."});
    }
    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (err) {
        return res.status(500).json({message: "Creating blog failed, please try again later."});
    }
    return res.status(201).json({message: "Blog created successfully!"});
}

export const updateBlog = async (req, res, next) => {
    const {title, description} = req.body;
    const blogId = req.params.id;
    let blog
    try {
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description
        });
    } catch (err) {
        const error = new Error("Updating blog failed, please try again later.");
        return next(error);
    }
    if(!blog){
        return res.status(404).json({message: "Could not find any blogs."});
    }
    return res.status(200).json({blog});
}

export const getBlogById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    }catch(err){
        const error = new Error("Fetching blog failed, please try again later.");
        return next(error);
    }
    if (!blog){
        return res.status(404).json({message: "Could not find the blog."});
    }
    return res.status(200).json({blog});
}

export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        const error = new Error("Deleting blog failed, please try again later.");
        return next(error);
    }
    if (!blog){
        return res.status(404).json({message: "Could not find the blog."});
    }
    return res.status(200).json({message: "Blog deleted successfully!"});
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    }catch(err){
        const error = new Error("Fetching user blogs failed, please try again later.");
        return next(error);
    }
    if (!userBlogs){
        return res.status(404).json({message: "Could not find the user blogs."});
    }
    return res.status(200).json({userBlogs});
}