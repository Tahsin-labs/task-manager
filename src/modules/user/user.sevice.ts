import { pool } from "../../db"
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs"
const createUserIntoDB = async (payload: IUser) => {

    const { name, email, password, age,role } = payload;

const hashPassword= await bcrypt.hash(password,10);

    const result = await pool.query(`
       INSERT INTO users (name, email , password ,age, role) VALUES($1,$2,$3,$4,COALESCE($5,'contributor')) RETURNING *
      `, [name, email,hashPassword , age,role])
//   for delete the password from result
    delete result.rows[0].password

    return result
}

const getAllUsersFromDB = async (payload: IUser) => {
    const result = await pool.query
        (`
      SELECT * FROM users 
      `)

    return result;
}

const getSingleUserFromDb = async (id: string) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE id=$1
        
        `, [id])

    return result;
}


const updateUserFromDb = async (payload: IUser, id: string) => {

    const { name, password, age, is_active } = payload;
    const result = await pool.query(`
     
    UPDATE users SET
     name=COALESCE($1,name),
     password=COALESCE($2,password),
     age=COALESCE($3,age),
     is_active=COALESCE($4,is_active)

      WHERE id=$5 RETURNING *
    
    `, [name, password, age, is_active, id],);

    return result
}


const deleteUserFromDb = async (id: string) => {
    const result = await pool.query(`
    DELETE FROM users WHERE id=$1  
   
    
    `, [id],);

    return result
}


export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDb,
    updateUserFromDb,
    deleteUserFromDb
}