import express, { type Application, type Request, type Response } from "express"
import { Pool } from "pg"
import config from "./config"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./auth/auth.route";
const app: Application = express()
const port = config.port;

app.use(express.json()) //-----middleWear

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

