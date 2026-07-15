import { Pool } from "pg"
import config from "../config"

export const pool = new Pool({
  connectionString: config.connection_string
})

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR (100),
      email VARCHAR (200) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      role VARCHAR(30)
      DEFAULT 'contributor'
      CHECK(role IN ('contributor','maintainer'))
      )
      `)

    //  create table for profile

    await pool.query(`
    CREATE TABLE IF NOT EXISTS profile(
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    address TEXT,
    phone VARCHAR(15),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    
    `)


    // issues table 

    await pool.query(`
CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(30)
        CHECK(type IN ('bug','feature_request'))
        NOT NULL,
    status VARCHAR(20)
        DEFAULT 'open'
        CHECK(status IN ('open','in_progress','resolved')),
    reporter_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
`)


    console.log("database connected ok")
  } catch (error) {
    console.log(error)
  }
}