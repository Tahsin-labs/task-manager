import bcrypt from "bcryptjs";
import { pool } from "../db";
import jwt from "jsonwebtoken";
import config from "../config";


const loginUserFromDB = async (payload: { email: string; password: string }) => {
    const { email, password } = payload

    // 1. check if user exist 
    // 2. compare password
    // 3. generate token
    const userData = await pool.query(`
    SELECT * FROM users WHERE email =$1
    `, [email])
   

  //  1. check if user exist 
    if (userData.rows.length === 0) {
        throw new Error("Invalid credentials")
    }
    const user = userData.rows[0];


 // 2. compare password
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log(matchPassword)
     if (!matchPassword) {
        throw new Error("Invalid credentials")
    }
    
      // 3. generate token

      const jwtpayload ={
        id: user.id,
        name: user.name,
        email:user.email,
        is_active:user.is_active,
      }
      
      
        const accessToken =jwt.sign(jwtpayload,config.secret as string,{expiresIn:"1d",});
      
 return {accessToken}

}

export const authService = {
    loginUserFromDB,
}