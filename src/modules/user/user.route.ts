import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./usre.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router()




router.post('/', userController.createUser)
router.get("/",auth(USER_ROLE.maintainer), userController.getAllUsers)
router.get("/:id", userController.getSingleUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)


export const userRoute = router