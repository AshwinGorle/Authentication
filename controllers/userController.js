import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import Jwt  from "jsonwebtoken";
class UserController{
    static userRegistration = async(req, res)=>{
        const {name, email, password, password_confirmation, tc} = req.body;
        console.log(name, email, password, password_confirmation, tc);
        const user = await UserModel.findOne({email : email});
        if(user){
            res.send({status : "failed", message : "Email already exists"});
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                    try{
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassowrd = await bcrypt.hash(password, salt)    
                    const doc = new UserModel({
                        name,
                        email,
                        password : hashedPassowrd,
                        tc : Boolean(tc)
                    })
                    await doc.save()
                    res.status(200).send({status : "success", msg : "User Created Successfully" })
                    }catch(err){
                        res.send({status : "failed", message : "User not created", err : err})
                    }
                }else{
                    res.send({status : "failed", message : "Confirmation msg does not match"});     
                }
            }else{
                res.send({status : "failed", message : "All fields are required"});     
            }
        }
    } 
}

export default UserController;