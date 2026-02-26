
import chalk from 'chalk';
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
const DB_URI = process.env.DB;
if (!DB_URI) {
  throw new Error("DB environment variable is not defined");
}

mongoose.connect(DB_URI)
.then(() => {
  console.log(
    chalk.bold.green("[ DATABASE ] ") + 
    chalk.white("auth        ") + 
    chalk.gray(" | ") + 
    chalk.bgGreen.black.bold(" OK ") + 
    chalk.green(" Connected Successfully")
  );
})
.catch(() => {
  console.log(
    chalk.bold.red("[ DATABASE ] ") + 
    chalk.white("auth        ") + 
    chalk.gray(" | ") + 
    chalk.bgRed.black.bold(" FAIL ") + 
    chalk.red(" Connection Rejected")
  );
});

import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import AuthRouter from './auth.router'
import cors from 'cors'

const PORT = process.env.PORT || 5000;
const app = express()
app.listen(PORT, ()=>{
 console.log(chalk.yellow.bold("auth" + " - Server running on port http://localhost:" + PORT));
})

app.use(cors({
  origin: process.env.CLIENT,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/auth", AuthRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from auth service!");
});

