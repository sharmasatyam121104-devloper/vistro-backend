import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
const DB_URI = process.env.DB;
if (!DB_URI) {
  throw new Error("DB environment variable is not defined");
}

mongoose.connect(DB_URI)
.then(()=>console.log("Auth - MongoDB connected successfully"))
.catch(()=>console.log("Auth -MongoDB connection failed"))

import express, { Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'

const PORT = process.env.PORT || 5000;
const app = express()
app.listen(PORT, ()=>{
    console.log(`Auth - Server running on port ${PORT}`);
})

app.use(cors({
    origin: process.env.CLIENT,
    credentials: true
}))
app.use(morgan('dev'))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from auth service!");
});