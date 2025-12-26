import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/training")

const userSchema = mongoose.Schema(
    {
        username: String,
        password: String,

    }
)
const userModel = mongoose.model("user", userSchema)

export default userModel