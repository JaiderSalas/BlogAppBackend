import  express from "express"; 
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
const app = express();

app.use("/api/user", router);

mongoose.connect(
    "mongodb+srv://admin:JvR0tkL7J4DzQ1rg@cluster0.yjdthgi.mongodb.net/?retryWrites=true&w=majority"
    ).then(() => app.listen(5000)).then(() => console.log("Server Running")
    )
    .catch((error) => console.log(error.message));
