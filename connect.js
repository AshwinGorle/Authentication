import mongoose from "mongoose";

const connectDatabase  = async()=>{
    return await mongoose.connect("mongodb://127.0.0.1:27017/Authentication", ()=>{
        console.log("mongodb connected");
    })
}

export default connectDatabase;