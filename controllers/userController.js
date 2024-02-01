import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import Jwt  from "jsonwebtoken";
class UserController{
    static userRegistration = async(req, res)=>{
        const {name, email, password, password_confirmation, tc} = req.body;
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
                    await doc.save();
                    const savedUser = await UserModel.findOne({email : email});
                    const token =  Jwt.sign({userId : savedUser._id, userEmail : savedUser.email}, process.env.JWT_SECRET_KEY, {expiresIn : '5d'});
                    res.status(201).send({status : "success", message : "User Created Successfully", token : token })
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

    static userLogin = async (req, res)=>{
        const {password, email} = req.body
        if(password && email){
            try{
                const user = await UserModel.findOne({email : email});
                if(user){
                  const isMatch = await bcrypt.compare(password, user.password);
                  if(isMatch && user.email === email){
                    const token  = Jwt.sign({userId : user._id, email : user.email}, process.env.JWT_SECRET_KEY);
                    res.send({status : "success", token : token, message : "Loged in successfully"});
                  }else{
                    res.send({status : "failed", message : "Email or Passowrd is wrong"})
                  }
                }else{
                    res.send({status : "failed", message : "Email does not exists"})
                }
            }catch(err){
               res.send({starus : "failed", message : "something went wrong", error : err})
            }
        }else{
            res.send({status : "failed", message : "All fields are required"})
        }
        
    }

    static resetUserPassword = async (req, res)=>{
        const {password,  password_confirmation} = req.body;
        if(password && password_confirmation){
           if(password === password_confirmation){
              try{
                const salt = await bcrypt.genSalt(10);
                const hashedPassowrd = await bcrypt.hash(password, salt);
                await UserModel.findByIdAndUpdate(req.user._id, {password : hashedPassowrd});
                res.send({status : "success", message : "Password changed successfully" })
              }catch(err){
                  res.send({status : "failed", message : "something went wrong try again"})
              }
           }else{
               res.send({status : "failed", message : "both password does not match"})
           }
        }else{
            res.send({status : "failed", message : "All fields are required"})
        }
    }
}

export default UserController;