import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/training")

const userSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        phone: Number,
        password: String,

    }
)
const userModel = mongoose.model("user", userSchema)

export default userModel