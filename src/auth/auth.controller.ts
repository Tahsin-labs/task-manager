import type { Request, Response } from "express"
import { authService } from "./auth.service"

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

export const authController = {
    loginUser
}