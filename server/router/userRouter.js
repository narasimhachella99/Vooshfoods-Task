import { Router } from "express";

import * as UserController from '../controllers/userController.js'
const userRouter= Router();
userRouter.post("/register",UserController.register);
userRouter.post("/login",UserController.login)
userRouter.get("/",UserController.getUsers)
userRouter.get("/:id",UserController.getUserById)
userRouter.put("/:id",UserController.updateUser)
userRouter.delete("/:id",UserController.deleteUser)
userRouter.post("/google-login",UserController.loginByGoogle)

export default userRouter;