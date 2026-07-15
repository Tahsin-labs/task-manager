import express, { type Application, type Request, type Response } from "express"
import { Pool } from "pg"
import config from "./config"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./auth/auth.route";
import logger from "./middleware/logger";
import CookieParser from "cookie-parser"
import cookieParser from "cookie-parser";
import cors from "cors"
import globalErrorHandler from "./middleware/globalErrorHandler";
import { issueRoute } from "./modules/Issues/issue.route";

const app: Application = express()
const port = config.port;


app.use(cookieParser())
app.use(express.json()) //-----middleWear
app.use(express.text()) //-----middleWear
app.use(express.urlencoded({ extended: true }))
app.use(logger)

app.use(cors({
  origin: 'http://localhost:5000',

}));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express server",
    "author": "Tahsin"
  })
})
app.use("/api/users", userRoute)
app.use("/api/profile", profileRoute)
app.use("/api/auth", authRoute)
app.use("/api/issues", issueRoute);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app

