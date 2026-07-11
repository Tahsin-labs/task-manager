import express, { type Application, type Request, type Response } from "express"
import { Pool } from "pg"
import config from "./config"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./auth/auth.route";
import fs from "fs"
const app: Application = express()
const port = config.port;

app.use(express.json()) //-----middleWear
app.use(express.text()) //-----middleWear
app.use(express.urlencoded({extended:true})
) 

app.use((req,res, next)=>{
  console.log("Method - URL - Time:", req.method, req.url, Date.now());
  const log = `Method -> ${req.method} Time -> ${Date.now()}URL ->${req.url}`
  fs.appendFile("logger.txt", log,(err)=>{
    console.log(err)
  })
  next();
})

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express server",
    "author": "Tahsin"
  })
})
app.use("/api/users", userRoute)
app.use("/api/profile", profileRoute)
app.use("/api/auth",authRoute)


export default app

