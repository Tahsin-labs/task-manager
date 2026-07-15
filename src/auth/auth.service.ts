import bcrypt from "bcryptjs";
import { pool } from "../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { IUser } from "../modules/user/user.interface";


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

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    is_active: user.is_active,
  }


  const accessToken = jwt.sign(jwtpayload, config.secret as string, { expiresIn: "1d", });



   const refreshToken = jwt.sign(jwtpayload, config.refresh_secret as string, { expiresIn: "10d", });

  return { accessToken,refreshToken }

}

//  refresh token function 

const  generateRefreshToken =async(token : string)=>{
 
            console.log(token)
            if (!token) {
                throw new Error("unknown!!")
            }
            //  decode jwt token
            const decoded = jwt.verify(token as string, config.refresh_secret as string) as JwtPayload;
            // console.log(decoded)

            const userData = await pool.query(`
    SELECT * FROM users WHERE email=$1
    `, [decoded.email])


            const user = userData.rows[0]
            //    console.log(user)
            if (userData.rows.length === 0) {
              throw new Error("user not found")
            }

            //  validate for is_active

            if (!user?.is_active) {
                throw new Error("forbidden")

            }
}


const signupUserIntoDB = async (payload: IUser) => {

    const {
        name,
        email,
        password,
        role,
    } = payload;

    // Check if email already exists
    const existUser = await pool.query(
        `
        SELECT * FROM users
        WHERE email = $1
        `,
        [email]
    );

    if (existUser.rows.length > 0) {
        throw new Error("Email already exists");
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
        `
        INSERT INTO users
        (
            name,
            email,
            password,
            role
        )
        VALUES
        (
            $1,$2,$3,COALESCE($4,'contributor')
        )
        RETURNING id,name,email,role,created_at,updated_at
        `,
        [
            name,
            email,
            hashPassword,
            role,
        ]
    );

    return result;
};

export const authService = {
  loginUserFromDB,generateRefreshToken, signupUserIntoDB,
}