import Jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const checkUserAuth = async (req, res, next) => {
  let token;
  const Authorization = req.headers["authorization"];
  if (Authorization && Authorization.startsWith("Bearer")) {
    try {
      token = Authorization.split(" ")[1];
      if (!token) {
        res
          .status(401)
          .send({ status: "failed", message: "Unauthorized user" });
      }
      //verifying token
      const { userId } = Jwt.verify(token, process.env.JWT_SECRET_KEY);

      //get user from token
      req.user = await UserModel.findOne({ _id: userId });
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send({ status: "failed", message: "Unauthorized user" });
    }
  } else {
    res.status(401).send({ status: "failed", message: "Unauthorized user" });
  }
};

export default checkUserAuth;
