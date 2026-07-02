import express, { type Application, type Request, type Response } from "express"
import {Pool} from "pg"
const app : Application= express()
const port = 5000

app.use(express.json()) //-----middleWear

const pool = new  Pool({
  connectionString : "postgresql://neondb_owner:npg_JjwL3f5XTzCK@ep-fragrant-flower-at4odiol-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

app.get('/', (req :Request, res: Response) => {
  res.status(200).json({
    message: "Express server",
    "author": "Tahsin"
  })
})


app.post('/',async(req:Request,res:Response)=>{
  //  console.log(req.body)

  const {name, email, password} =req.body;
  res.status(201).json({
    message: "created",
    data:name,email,
  });
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})