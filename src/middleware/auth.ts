import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";
import type { ROLE } from "../types";

// 1) check if the toke exist 
// 2)verify the user token 
// 3)find the user in database 
// 4)if the user active or not




const auth = (...roles: ROLE[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles)
        try {
            // console.log("this is protected route!!")
            // console.log(req.headers.authorization)

            const token = req.headers.authorization;
            console.log(token)
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized access!!",

                })
            }
            //  decode jwt token
            const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload;
            console.log(decoded)

            const userData = await pool.query(`
    SELECT * FROM users WHERE email=$1
    `, [decoded.email])


            const user = userData.rows[0]
            //    console.log(user)
            if (userData.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "user not found!!",

                })
            }

            //  validate for is_active

            if (!user?.is_active) {
                res.status(403).json({
                    success: false,
                    message: "forbidden!!",

                })

            }

            // auth role added

            if (roles.length && !roles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: "forbidden!!, This role have no access",

                })

            }



            req.user = decoded
            next()

        } catch (error) {
            next(error)
        }
    }
}


export default auth