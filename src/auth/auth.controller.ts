import type { Request, Response } from "express"
import { authService } from "./auth.service"
import { userService } from "../modules/user/user.sevice"

const loginUser = async (req: Request, res: Response) => {
    try {

    const result = await authService.loginUserFromDB(req.body)
    
    // create refresh token 
     const {refreshToken}= result
     res.cookie("refreshToken",refreshToken,{
        secure : false,
        httpOnly: true,
        sameSite: 'lax'
     })

        res.status(201).json({
            success: true,
            message: "profile created successfully!",
            date: result,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        })
    }
}








const refreshToken= async(req: Request, res: Response)=>{
  try {

    const result = await authService.generateRefreshToken(req.cookies.refreshToken)
    
  
        res.status(200).json({
            success: true,
            message: "Access token generate!",
            date: result,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        })
    }
}




const signupUser = async (req: Request, res: Response) => {
    try {

        const result = await userService.createUserIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


export const authController = {
    loginUser,refreshToken, signupUser,
}