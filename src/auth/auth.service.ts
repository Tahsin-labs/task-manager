import bcrypt from "bcryptjs";
import { pool } from "../db";

const loginUserFromDB = async (payload: { email: string; password: string }) => {
    const { email, password } = payload

    // 1. check if user exist 
    // 2. compare password
    // 3. generate token
    const userData = await pool.query(`
    SELECT * FROM users WHERE email =$1
    `, [email])


    if (userData.rows.length === 0) {
        throw new Error("Invalid credentials")
    }
    const user = userData.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log(matchPassword)
     if (!matchPassword) {
        throw new Error("Invalid credentials")
    }

}

export const authService = {
    loginUserFromDB,
}